# Gera o APK de release só para a ABI do emulador, reinstala via adb e abre o app.
# Uso: npm run android:install   (ou: powershell -File scripts/android-install.ps1 -Abi arm64-v8a -Device <serial>)
param(
	[string]$Device = '127.0.0.1:5555',
	[string]$Abi = 'x86_64',
	[string]$Adb = 'C:\Android\platform-tools\adb.exe',
	[string]$Package = 'com.guaravivo.app'
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

Push-Location (Join-Path $root 'android')
# Release minificado, 1 ABI, assinado com a debug.keystore (teste local; não é o APK de publicação).
try { & .\gradlew.bat assembleRelease "-PreactNativeArchitectures=$Abi" -PlocalDebugSign --console=plain; if ($LASTEXITCODE) { throw 'Build falhou.' } }
finally { Pop-Location }

$apk = Join-Path $root 'android\app\build\outputs\apk\release\app-release.apk'
& $Adb connect $Device | Out-Null
$out = & $Adb -s $Device install -r $apk 2>&1 | Out-String
if ($out -match 'INSTALL_FAILED_UPDATE_INCOMPATIBLE') {
	Write-Host 'Assinatura diferente da instalada: desinstalando (apaga dados locais do app) e reinstalando.'
	& $Adb -s $Device uninstall $Package | Out-Null
	$out = & $Adb -s $Device install $apk 2>&1 | Out-String
}
if ($out -notmatch 'Success') { throw "Instalação falhou: $out" }
& $Adb -s $Device shell monkey -p $Package -c android.intent.category.LAUNCHER 1 | Out-Null
Write-Host "Instalado e aberto em $Device ($Abi)."
