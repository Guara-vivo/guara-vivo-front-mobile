# Guará Vivo Mobile

Aplicativo mobile (React Native + Expo) do Guará Vivo, usado em campo pelos pesquisadores e fiscais da ARIE para registrar avistamentos de guarás-vermelhos.

O que o app faz:

- Login e sessão (o token é renovado automaticamente).
- **Registrar** avistamento: fotos, local no mapa, data/hora e comportamento. Funciona offline: o registro fica guardado no aparelho e é enviado quando a internet volta.
- **Histórico** com busca e filtros, e **detalhe** de cada registro com o resultado da análise de IA (quantidade, cor, fase de vida e confiança por imagem).
- **Mapas** com as zonas de alimentação e ninhos.

Ele conversa com a [API](https://github.com/Guara-vivo/guara-vivo-api); a análise de IA acontece no servidor.

**Stack:** Expo SDK 54, React Native 0.81, React 19, TypeScript, React Navigation, `react-native-maps` (Google Maps).

## O que você precisa antes

- **Node.js 22** (é a versão usada no CI) e npm
- **Android Studio** com o Android SDK, e um emulador ou um celular com depuração USB. O app usa módulos nativos (mapas), por isso o fluxo principal é o build nativo do Android.
- A **API rodando** (veja o README do `guara-vivo-api`)
- Uma **chave do Google Maps** (Maps SDK for Android), para o mapa aparecer

## Rodando localmente

```bash
npm ci
cp .env.example .env     # no PowerShell: copy .env.example .env
```

Edite o `.env`:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP:8001
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=sua-chave-do-google-maps
```

**Qual URL usar na `EXPO_PUBLIC_API_URL`** (a API roda no seu computador, porta `8001`):

| Onde o app roda | URL |
| --- | --- |
| Emulador do Android Studio | `http://10.0.2.2:8001` |
| Celular físico ou BlueStacks | `http://IP-DO-SEU-PC-NA-REDE:8001` (ex.: `http://192.168.0.10:8001`), com o PC e o aparelho na mesma rede |
| iOS (simulador) | `http://localhost:8001` |

> **Atenção:** se você não definir `EXPO_PUBLIC_API_URL`, o app em modo dev usa o IP fixo `192.168.18.145` no Android, que é de outra máquina. Sempre defina a variável. Em produção a URL é obrigatória e precisa ser HTTPS.

Depois de editar o `.env`, reinicie o Metro com cache limpo (`npx expo start -c`), porque o Expo só lê as variáveis na inicialização.

Rode o app no Android (com emulador aberto ou celular conectado):

```bash
npm run android        # compila o app nativo e abre no aparelho
```

A primeira compilação demora (vários minutos). Nas próximas, o app já instalado se conecta ao Metro. Para iniciar só o servidor de desenvolvimento:

```bash
npm start
```

### Testar um APK de verdade (release)

Para ver o app como ele vai para o usuário, sem depender do Metro, existe o script `npm run android:install` (Windows/PowerShell). Ele compila um APK release de uma ABI só, instala via `adb` e abre o app. Por padrão assume o BlueStacks em `127.0.0.1:5555` e o `adb` em `C:\Android\platform-tools\adb.exe`; os parâmetros estão no topo de `scripts/android-install.ps1`. Esse APK é assinado com chave de debug: **nunca o publique**.

## Verificações

O CI roda estes três comandos. Rode-os antes de abrir um PR:

```bash
npm run typecheck
npm run lint
npm test
```

## Estrutura

```
src/
├── GuaraVivoApp.tsx   navegação principal
├── screens/           telas (Home, Histórico, Mapas, Registrar, Perfil...)
├── components/        componentes reutilizáveis
├── hooks/             lógica reutilizável (histórico, registro, mapa, conexão)
├── services/          API, autenticação, cache e sincronização
├── utils/             funções puras (com testes)
├── styles/            estilos por assunto
└── constants/theme.ts cores, espaçamentos e fontes
android/               projeto Android nativo (versionado)
```

## Dicas

- **O mapa aparece em branco:** a chave do Google Maps não foi lida. Confira `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` no `.env` e refaça o build (`npm run android`), pois ela entra no `AndroidManifest` na compilação.
- **O app não alcança a API:** teste a URL no navegador do aparelho (`http://SEU_IP:8001/health`). Confira firewall do PC e se a API escuta em `0.0.0.0`.
- **Nunca commite** o `.env` nem o `android/app/app.keystore`.
