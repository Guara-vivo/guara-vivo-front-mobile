# Balão do avistamento no mapa do admin

Status: **aprovado pela equipe em 2026-11-18**. Ainda não construído.

## Intenção

O admin vê no mapa os registros de todos os usuários. Hoje tocar num marcador leva direto à página de
detalhes, o que é pesado para quem só quer espiar. Um balão ancorado no marcador mostra o essencial no
lugar, e o detalhe fica a mais um toque.

## O que o balão mostra (decidido com a equipe)

- autor do registro
- número do registro (`#182`)
- data e hora
- quantidade de guarás

Os quatro dados já vêm no resumo do registro (`author_name`, `id`, `date_time`, `ibis_quantity`); não
há chamada nova na API.

```
   ┌─────────────────────────┐
   │ Ana Flávia        #180  │
   │ 2 guarás · 16/11, 16:01 │
   └───────────▼─────────────┘
          (marcador)
```

## Objetivos

- Tocar num marcador de registro abre o balão sobre ele; tocar no balão abre o detalhe.
- Só no mapa do admin. Contas comuns seguem exatamente como hoje.

## Não objetivos

- Foto, comportamento, status ou botões dentro do balão.
- Um cartão fixo na parte de baixo (descartado: não parte do marcador).
- Mudar o que o admin vê com a folha de uma zona aberta (continua destacando e rolando até o registro).

## Anti-objetivos (falharia mesmo funcionando)

- O balão atrapalhar o toque em zonas e marcadores vizinhos.
- O balão sair da tela ou ficar sob os chips de camada.
- O balão tremer ou ficar para trás ao mover o mapa.

## Abordagens consideradas

- **A. Balão nativo (`Callout`).** Pouco código e ancorado sozinho, mas no Android vira imagem estática,
  com visual limitado e sem botões. Descartada pelo visual.
- **B. Balão nosso (View sobre o mapa). Escolhida pela equipe.** Visual do app, controle total; custa
  reposicionar quando o mapa se move.
- **C. Cartão fixo embaixo.** Descartada: a equipe já tinha recusado cartão e ele não parte do marcador.

## Decisões (como foram tomadas)

Da equipe: abordagem B; só mapa do admin; conteúdo de quatro dados.

Minhas, para a equipe corrigir:

- Tocar no marcador passa a abrir o balão (hoje abre o detalhe). Tocar no balão abre o detalhe.
- O balão fecha ao tocar no mapa vazio, ao tocar em outro marcador (que abre o dele) e ao mover o
  mapa; reaparece no lugar certo quando o movimento termina, em vez de acompanhar cada quadro.
- Posição pelo `pointForCoordinate` do mapa; balão acima do marcador com a pontinha apontando para ele;
  se não couber acima (perto do topo ou dos chips), vai abaixo; margem lateral de 16 dp.
- Visual só com tokens do tema (sem cores literais), textos em pt-BR e en-US, e acessibilidade como
  botão ("Abrir detalhes do registro N").
- Data e hora com os formatadores que o app já usa.
- Toque em grupo de marcadores (se o agrupamento for adiante) aproxima o mapa, sem balão.

## Deixado para quem construir

Medidas exatas, animação de entrada e saída, e tratamento de rotação de tela (o app é só retrato).

## Testes

Cálculo da posição do balão (acima, abaixo, limite lateral) como função pura com teste primeiro. O
restante (toque, fechar, mover o mapa) conferido no emulador e no celular.
