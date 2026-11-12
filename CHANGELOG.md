# Changelog

Mudanças do aplicativo Guará Vivo (mobile), uma seção por versão. O fluxo de release está em `AGENTS.md`, na seção **Versionamento e releases**.

Formato: [Semantic Versioning](https://semver.org/lang/pt-BR/). Toda mudança visível ao usuário entra em "Não lançado" no mesmo PR que a introduz.

## [Não lançado]

### Adicionado
- A versão do app aparece na tela de entrar, para o suporte saber o que está instalado mesmo sem conseguir logar.

### Alterado
- O cadastro de novas contas está fechado (a API não aceita mais o cadastro): "Criar conta", na tela inicial e na de entrar, mostra o aviso "Cadastro indisponível" em vez de abrir a tela de cadastro.
- O login agora diferencia o motivo da falha: e-mail ou senha errados, sem conexão, conexão lenta, servidor indisponível e erro no próprio aparelho, cada um com sua mensagem. Antes, qualquer falha que não fosse resposta da API aparecia como "Sem conexão".
- O login tenta de novo uma vez quando a rede falha antes de o servidor responder (não repete em timeout nem quando a API recusa).

### Corrigido
- A tela "Sobre o app" mostrava "Versão 1.0.0" fixa; agora mostra a versão real instalada.

## [0.1.1] - 2026-11-11 (versionCode 2)

### Alterado
- A API passa a ser `https://api.guaravivo.com.br`. O endereço antigo (`guaravivo-backend.ddns.net`) foi removido do servidor em 2026-11-11; builds que ainda usem esse endereço precisam atualizar para a 0.1.1 para conseguir entrar.

### Observação
- O histórico anterior não foi catalogado por versão: não há tag da 0.1.0 nem registro do que ela continha. A partir daqui, cada versão lista suas mudanças.

## [0.1.0]

Sem registro detalhado do que continha.
