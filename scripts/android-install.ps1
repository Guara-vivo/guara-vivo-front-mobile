# Gera o APK de release só para a ABI do emulador, reinstala via adb e abre o app.
# Uso: npm run android:install
#      npm run android:install -- -EnvFile C:\guara-vivo-front-end\.env   (.env de outro checkout)
#      npm run android:install -- -Abi arm64-v8a -Device <serial>
# Cuida de: variáveis do build, caminho longo (subst), bundle JS antigo, assinatura e reinstalação.
param(
	[string]$Device = '127.0.0.1:5555',
	[string]$Abi = 'x86_64',
	[string]$Adb = 'C:\Android\platform-tools\adb.exe',
	[string]$Package = 'com.guaravivo.app',
	[string]$EnvFile = ''
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
# SHA-1 do debug.keystore (o que a chave do Google Maps aceita no teste) e do app.keystore (publicação).
$mapsSha1 = @('5e8f16062ea3cd2c4a0d547876baa6f38cabf625', '7a75bb5a573b842ab55405f2623ba41d7f236c36')

# 1) Variáveis embutidas no build. O ambiente vence; depois -EnvFile; depois o .env da raiz do repositório.
$required = @('EXPO_PUBLIC_API_URL', 'EXPO_PUBLIC_GOOGLE_MAPS_API_KEY')
function Import-EnvFile([string]$Path) {
	if (-not (Test-Path $Path)) { return }
	foreach ($line in Get-Content $Path) {
		if ($line -match '^\s*(?<k>[A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?<v>.*?)\s*$') {
			$name = $Matches['k']; $value = $Matches['v'] -replace '^["'']|["'']$', ''
			if (($required -contains $name) -and -not [Environment]::GetEnvironmentVariable($name)) {
				Set-Item -Path "env:$name" -Value $value
			}
		}
	}
}
if ($EnvFile) { Import-EnvFile $EnvFile }
Import-EnvFile (Join-Path $root '.env')
$missing = @($required | Where-Object { -not [Environment]::GetEnvironmentVariable($_) })
if ($missing.Count) {
	throw "Faltam variáveis do build: $($missing -join ', '). Crie o .env na raiz do repositório (modelo em .env.example) ou passe -EnvFile <caminho do .env>."
}
if ($env:EXPO_PUBLIC_API_URL -notmatch '^https://') { throw 'EXPO_PUBLIC_API_URL precisa ser uma URL https:// (o app de release recusa HTTP).' }

# 2) Caminho longo: o CMake/ninja estoura 260 caracteres. Mapeia a PASTA PAI como M: (a raiz da unidade
# quebra o autolinking do Expo) e desmapeia no fim.
$mappedDrive = $null
if ($root.Length -gt 60) {
	$drive = 'M:'; $leaf = Split-Path -Leaf $root
	if (-not (Test-Path "$drive\$leaf\package.json")) {
		if (Test-Path "$drive\") { throw "$drive já está em uso por outro mapeamento. Libere com: subst $drive /D" }
		subst $drive (Split-Path -Parent $root)
		if ($LASTEXITCODE) { throw "Não consegui mapear $drive para o caminho curto." }
		$mappedDrive = $drive
	}
	$root = "$drive\$leaf"
}

try {
	# 3) O Gradle não refaz o bundle JS quando só muda uma variável EXPO_PUBLIC_* (ou um asset).
	Remove-Item -Recurse -Force (Join-Path $root 'android\app\build\generated\assets\createBundleReleaseJsAndAssets') -ErrorAction SilentlyContinue

	# 4) Release minificado, 1 ABI, assinado com o debug.keystore do repositório (teste local; não é o APK de publicação).
	Push-Location (Join-Path $root 'android')
	try { & .\gradlew.bat assembleRelease "-PreactNativeArchitectures=$Abi" -PlocalDebugSign --console=plain; if ($LASTEXITCODE) { throw 'Build falhou.' } }
	finally { Pop-Location }
	$apk = Join-Path $root 'android\app\build\outputs\apk\release\app-release.apk'

	# 5) Confere a assinatura: com outro SHA-1 o Google Maps recusa a chave e o mapa fica cinza.
	$signer = Get-ChildItem 'C:\Android\build-tools\*\apksigner.bat' -ErrorAction SilentlyContinue | Sort-Object FullName | Select-Object -Last 1
	if ($signer) {
		$sha = ((& $signer.FullName verify --print-certs $apk | Select-String 'SHA-1 digest') -replace '.*digest:\s*', '').Trim().ToLower()
		Write-Host "Assinatura do APK (SHA-1): $sha"
		if ($mapsSha1 -notcontains $sha) { Write-Warning 'SHA-1 fora da lista aceita pela chave do Google Maps: o mapa vai falhar ("Authorization failure").' }
	}

	# 6) Instala. O stderr do adb não pode derrubar o script (no PowerShell 5.1 vira erro terminante).
	function Invoke-Adb([string[]]$AdbArgs) {
		$prev = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
		try { return (& $Adb @AdbArgs 2>&1 | Out-String) } finally { $ErrorActionPreference = $prev }
	}
	Invoke-Adb @('connect', $Device) | Out-Null
	$out = Invoke-Adb @('-s', $Device, 'install', '-r', $apk)
	if ($out -match 'INSTALL_FAILED_UPDATE_INCOMPATIBLE') {
		Write-Host 'Assinatura diferente da instalada: desinstalando (apaga dados locais do app) e reinstalando.'
		Invoke-Adb @('-s', $Device, 'uninstall', $Package) | Out-Null
		$out = Invoke-Adb @('-s', $Device, 'install', $apk)
	}
	if ($out -notmatch 'Success') { throw "Instalação falhou: $out" }
	Invoke-Adb @('-s', $Device, 'shell', 'monkey', '-p', $Package, '-c', 'android.intent.category.LAUNCHER', '1') | Out-Null
	Write-Host "Instalado e aberto em $Device ($Abi)."
}
finally {
	if ($mappedDrive) { Set-Location $env:SystemDrive\; subst $mappedDrive /D | Out-Null }
}
