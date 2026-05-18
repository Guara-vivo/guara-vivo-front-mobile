# Integracao com a Guara Vivo API

Este guia descreve como integrar o app React Native/Expo com a API CRUD `guara-vivo-api`.

## Base URL

Use a URL conforme o ambiente de execucao do app:

```ts
const API_URL = "http://10.0.2.2:8001" // Android emulator
// const API_URL = "http://localhost:8001" // iOS simulator
// const API_URL = "http://SEU_IP_LOCAL:8001" // aparelho fisico
```

Em aparelho fisico, o celular e o computador precisam estar na mesma rede. A API deve estar acessivel na rede local.

## Autenticacao

Rotas protegidas exigem:

```text
Authorization: Bearer <access_token>
```

O login retorna o token e os dados do usuario.

```ts
type UserRead = {
  id: number
  name: string
  email: string
}

type LoginResponse = {
  access_token: string
  token_type: "bearer"
  user: UserRead
}
```

### Login

```ts
async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`)
  }

  return response.json()
}
```

### Persistir Token

O projeto ja possui `@react-native-async-storage/async-storage`.

```ts
import AsyncStorage from "@react-native-async-storage/async-storage"

const TOKEN_KEY = "guara_vivo_access_token"

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token)
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY)
}

export async function clearToken() {
  await AsyncStorage.removeItem(TOKEN_KEY)
}
```

### Validar Sessao

```ts
async function getCurrentUser(token: string): Promise<UserRead> {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Session validation failed: ${response.status}`)
  }

  return response.json()
}
```

## Tipos da API

```ts
export type BirdBehavior =
  | "ninhando"
  | "vocalizando"
  | "alimentando-se"
  | "voando"

export type RecordStatus = "pending" | "processing" | "completed" | "failed"

export type RecordRead = {
  id: number
  images: string[]
  latitude_camera: number
  longitude_camera: number
  behavior: BirdBehavior[]
  date_time: string
  user_id: number
  status: RecordStatus
}

export type AnalysisRead = {
  id: number
  ibis_quantity: number
  datetime: string
  recorder_id: number
}

export type IbisRead = {
  id: number
  color: string
  age_group: string
  analysis_id: number
}
```

## Upload de Imagens

Endpoint principal para o app:

```text
POST /records/upload
```

Content-Type enviado pelo React Native:

```text
multipart/form-data
```

Campos:

| Campo | Tipo | Obrigatorio | Observacao |
| --- | --- | --- | --- |
| `images` | File[] | Sim | 1 a 20 imagens. Repetir o campo para multiplos arquivos. |
| `latitude_camera` | number | Sim | Entre -90 e 90. |
| `longitude_camera` | number | Sim | Entre -180 e 180. |
| `behavior` | string[] | Sim | Repetir o campo para multiplos comportamentos. |
| `date_time` | string | Sim | ISO datetime. Ex.: `new Date().toISOString()`. |

Valores validos para `behavior`:

```text
ninhando
vocalizando
alimentando-se
voando
```

### Exemplo com uma imagem

Nao defina manualmente o header `Content-Type` no upload. O React Native precisa adicionar o `boundary` automaticamente.

```ts
type ReactNativeFile = {
  uri: string
  name: string
  type: string
}

async function uploadRecord(params: {
  token: string
  image: ReactNativeFile
  latitude: number
  longitude: number
  behavior: BirdBehavior[]
  dateTime?: Date
}): Promise<RecordRead> {
  const formData = new FormData()

  formData.append("images", params.image as unknown as Blob)
  formData.append("latitude_camera", String(params.latitude))
  formData.append("longitude_camera", String(params.longitude))

  for (const item of params.behavior) {
    formData.append("behavior", item)
  }

  formData.append("date_time", (params.dateTime ?? new Date()).toISOString())

  const response = await fetch(`${API_URL}/records/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Upload failed: ${response.status} ${errorBody}`)
  }

  return response.json()
}
```

### Exemplo com multiplas imagens

```ts
async function uploadRecordWithImages(params: {
  token: string
  images: ReactNativeFile[]
  latitude: number
  longitude: number
  behavior: BirdBehavior[]
}): Promise<RecordRead> {
  const formData = new FormData()

  for (const image of params.images) {
    formData.append("images", image as unknown as Blob)
  }

  formData.append("latitude_camera", String(params.latitude))
  formData.append("longitude_camera", String(params.longitude))

  for (const item of params.behavior) {
    formData.append("behavior", item)
  }

  formData.append("date_time", new Date().toISOString())

  const response = await fetch(`${API_URL}/records/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${params.token}` },
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`)
  }

  return response.json()
}
```

## Fluxo de Processamento

Depois do upload:

1. API salva a imagem no Supabase Storage.
2. API cria um `record` com `status = "pending"`.
3. API publica o `record_id` no RabbitMQ.
4. Worker altera o status para `processing`.
5. Worker chama a API de IA.
6. Worker grava `analysis` e `ibis`.
7. Worker altera o status para `completed`.

Se algo falhar no worker, o status vira `failed`.

## Consultar Status do Record

```ts
async function getRecord(token: string, recordId: number): Promise<RecordRead> {
  const response = await fetch(`${API_URL}/records/${recordId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Record fetch failed: ${response.status}`)
  }

  return response.json()
}
```

### Polling Simples

```ts
async function waitRecordCompletion(token: string, recordId: number) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const record = await getRecord(token, recordId)

    if (record.status === "completed" || record.status === "failed") {
      return record
    }

    await new Promise((resolve) => setTimeout(resolve, 3000))
  }

  throw new Error("Record processing timeout")
}
```

## Buscar Analise

Endpoint atual:

```text
GET /analysis?skip=0&limit=100
```

A API ainda nao tem filtro por `recorder_id`, entao o app deve filtrar localmente por enquanto.

```ts
async function getRecordAnalysis(token: string, recordId: number): Promise<AnalysisRead | null> {
  const response = await fetch(`${API_URL}/analysis?skip=0&limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Analysis fetch failed: ${response.status}`)
  }

  const analyses = (await response.json()) as AnalysisRead[]
  return analyses.find((analysis) => analysis.recorder_id === recordId) ?? null
}
```

## Buscar Ibis da Analise

Endpoint atual:

```text
GET /ibis?skip=0&limit=100
```

A API ainda nao tem filtro por `analysis_id`, entao o app deve filtrar localmente por enquanto.

```ts
async function getAnalysisIbis(token: string, analysisId: number): Promise<IbisRead[]> {
  const response = await fetch(`${API_URL}/ibis?skip=0&limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Ibis fetch failed: ${response.status}`)
  }

  const ibis = (await response.json()) as IbisRead[]
  return ibis.filter((item) => item.analysis_id === analysisId)
}
```

## Criar Record com URL Ja Existente

Use este endpoint apenas se o app ja possuir URLs publicas das imagens:

```text
POST /records/
```

Para imagens locais do celular, prefira `POST /records/upload`.

```ts
async function createRecordWithUrls(token: string, payload: Omit<RecordRead, "id">) {
  const response = await fetch(`${API_URL}/records/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Record creation failed: ${response.status}`)
  }

  return response.json() as Promise<RecordRead>
}
```

## Erros Comuns

| Status | Causa comum | Acao no app |
| --- | --- | --- |
| `400` | Payload invalido | Revisar corpo enviado. |
| `401` | Token ausente, invalido ou expirado | Redirecionar para login. |
| `403` | Recurso pertence a outro usuario | Mostrar erro de permissao. |
| `409` | Email ja cadastrado | Mostrar mensagem no cadastro. |
| `413` | Arquivo ou body grande demais | Comprimir imagem ou limitar tamanho. |
| `422` | Campo faltando ou valor invalido | Validar formulario antes de enviar. |
| `502` | Falha no upload ao Supabase | Permitir tentar novamente. |
| `503` | Record criado, mas falhou fila RabbitMQ | Mostrar estado de falha/suporte. |

## Estrutura Recomendada no Frontend

```text
src/services/apiClient.ts
src/services/authService.ts
src/services/recordsApi.ts
src/types/api.ts
```

### `apiClient.ts`

```ts
export const API_URL = "http://10.0.2.2:8001"

export async function apiFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, options)

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`${response.status}: ${body}`)
  }

  return response
}
```

## Migracao dos Mocks

O frontend ainda possui mocks em:

```text
src/services/recordsService.ts
src/data/mockRecords.ts
src/types/records.ts
```

Migre gradualmente:

1. Criar tipos reais da API em `src/types/api.ts`.
2. Criar `src/services/recordsApi.ts` com chamadas HTTP.
3. Adaptar telas para consumir API real.
4. Manter mocks como fallback apenas durante desenvolvimento.
5. Remover campos antigos que nao existem mais na API, como `flock_size`, `latitude` e `longitude` em `Analysis`.

## Checklist de Integracao

- API rodando em `http://localhost:8001`.
- Celular/emulador consegue acessar a base URL correta.
- Login retorna `access_token`.
- Token salvo no AsyncStorage.
- `POST /records/upload` envia `FormData` sem header manual `Content-Type`.
- `behavior` enviado como campos repetidos.
- `record.id` salvo para polling.
- App acompanha `status` ate `completed` ou `failed`.
- App busca `analysis` e `ibis` apos conclusao.
