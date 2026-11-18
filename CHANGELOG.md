# Changelog

Mudanças do aplicativo Guará Vivo (mobile), uma seção por versão. O fluxo de release está em `AGENTS.md`, na seção **Versionamento e releases**.

Formato: [Semantic Versioning](https://semver.org/lang/pt-BR/). Toda mudança visível ao usuário entra em "Não lançado" no mesmo PR que a introduz.

## [Não lançado]

Nada ainda.

## [0.2.0] - 2026-11-18 (versionCode 4)

### Adicionado
- O aplicativo agora também está em inglês (en-US). A bandeirinha na tela de boas-vindas e na de entrar mostra o idioma atual e troca para o outro com um toque; no Perfil, o grupo "Conta" tem a opção "Idioma". A escolha fica só no aparelho e, na primeira abertura, o app começa em português. As datas seguem o idioma (em inglês, mês antes do dia e horário de 12 h com AM/PM), e o mapa do Google continua em português.
- Contas de administração veem no mapa os registros de todas as pessoas, não só os próprios. Registros próximos se juntam em grupos com a contagem (toque no grupo para aproximar); registros de outras pessoas têm marcador laranja, e os seus, vermelho. Tocar num registro mostra um balão com o autor, o número, a quantidade de guarás e a data e hora, e tocar no balão abre o detalhe. Um botão de olho esconde os ícones das áreas, deixando só o círculo.
- No histórico, a conta de administração também lista os registros de todas as pessoas, com a linha "Enviado por …" em cada um.

### Alterado
- O aplicativo abre mais rápido para quem já está conectada: a tela inicial aparece logo, sem esperar a internet, e a conta é conferida em segundo plano. Se o servidor encerrar a sessão, o app volta para a tela de entrar.
- O APK ficou bem menor (de cerca de 85 MB para cerca de 44 MB): a versão de instalação passa a levar só o que os celulares Android usam. Quem já tem o app instalado não precisa fazer nada; ele não roda mais em emulador x86 sem tradução ARM.
- O filtro de período do histórico agora usa um calendário só: toque no dia inicial e depois no final, com a faixa pintada, e atalhos de 7 dias, 30 dias e este mês. A data inicial não pode mais ficar maior que a final.

### Corrigido
- Na folha de uma área do mapa, a lista de registros mostrava só os 4 primeiros e não rolava: os demais ficavam inalcançáveis, mesmo com o número certo no cabeçalho (por exemplo, "10 registros" e só 4 linhas). Agora a lista inteira aparece e rola junto com a folha.
- Na tela inicial, os números e o último avistamento não ficam mais escondidos por um esqueleto em boa parte das aberturas: quando o aplicativo já tem a lista guardada no celular, ele a mostra na hora e só indica "Atualizando…" enquanto confere com o servidor. O esqueleto continua só quando não há nada para mostrar.
- A folha de detalhes de uma área do mapa não fecha mais sem querer ao arrastar de volta para a posição original; agora só fecha com um arrasto longo para baixo (ou pelo X).
- Na confirmação de excluir uma área do mapa, os botões "Cancelar" e "Excluir" ficavam cortados embaixo da tela; agora a folha cresce até caber o conteúdo.
- Em algumas aberturas do aplicativo (cerca de 1 em 10) a tela inicial não usava a lista guardada no celular e ficava com esqueleto até o servidor responder; agora ela é usada em todas as aberturas.

## [0.1.2] - 2026-11-12 (versionCode 3)

### Adicionado
- A versão do app aparece na tela de entrar, para o suporte saber o que está instalado mesmo sem conseguir logar.

### Alterado
- O cadastro de novas contas está fechado (a API não aceita mais o cadastro): "Criar conta", na tela inicial e na de entrar, mostra o aviso "Cadastro indisponível" em vez de abrir a tela de cadastro.
- O login agora diferencia o motivo da falha: e-mail ou senha errados, sem conexão, conexão lenta, servidor indisponível e erro no próprio aparelho, cada um com sua mensagem. Antes, qualquer falha que não fosse resposta da API aparecia como "Sem conexão".
- O login tenta de novo uma vez quando a rede falha antes de o servidor responder (não repete em timeout nem quando a API recusa).

### Corrigido
- A tela "Sobre o app" mostrava "Versão 1.0.0" fixa; agora mostra a versão real instalada.
- No detalhe do registro, a foto principal não fica mais em branco ao reabrir o mesmo registro (a foto era carregada duas vezes, em tamanhos diferentes, ao abrir a tela).

## [0.1.1] - 2026-11-11 (versionCode 2)

### Alterado
- A API passa a ser `https://api.guaravivo.com.br`. O endereço antigo (`guaravivo-backend.ddns.net`) foi removido do servidor em 2026-11-11; builds que ainda usem esse endereço precisam atualizar para a 0.1.1 para conseguir entrar.

### Observação
- O histórico anterior não foi catalogado por versão: não há tag da 0.1.0 nem registro do que ela continha. A partir daqui, cada versão lista suas mudanças.

## [0.1.0]

Sem registro detalhado do que continha.
