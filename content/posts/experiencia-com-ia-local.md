---
title: "Minha experiência usando IA local"
subtitle: "Tenho um computador relativamente bom e queria experimentar para ter minha própria opinião"
category: "programacao"
date: "2026-10-19"
tags:
  - IA
  - aprendizado
  - opinião
draft: false
---

Recentemente decidi me aventurar com as IAs locais para saber se realmente era um diferencial ou se valeria a pena pelo menos testar, ou ter reservado para algumas situações de emergência. Confesso que tive uma bela de uma decepção, mas vamos por partes.

Eu não sou rico, nem tenho dinheiro pra ficar jogando fora e testando tudo que dá na telha simplesmente porque sim, então estava buscando uma forma de manter o ritmo do desenvolvimento enquanto recupero os tokens do meu plano do ChatGPT Plus. Nesse momento decidi instalar a IA para rodar localmente na minha máquina para, nos intervalos entre o momento que acabasse o limite e o momento em que ele fosse restaurado, eu usasse a IA local para continuar o desenvolvimento, partindo de tarefas mais simples, porque sei que não tenho hardware para muita coisa.

Meu pc é uma RTX 3050 6GB VRAM com 32GB RAM, um hardware muito bom pra muita coisa, menos rodar IA kkkkkk.

De início achei que nem funcionaria, mas descobri que existem modelos mais simplificados e foi por onde comecei, coloquei o Qwen3:4b, instalando pelo Ollama, para basicamente documentar o progresso e ir ajustando detalhes do código, o meu primeiro comando foi para esse site que você está lendo e foi:

```
Adicione uma seção com o nome "Futebol" ao header
```
E... ele não conseguiu...

Eu sei que o computador não é lá essas coisas, e que poderia ser uma barreira, mas esse comando deveria ser algo tão simples que não deveria nem usar tanto a capacidade do computador, e não foi esse o problema.

Depois de algumas pesquisas, descobri que para o modelo conseguir acesso às pastas do computador ele precisava de um harness, eu usei o Pi e repeti o processo, rodei o mesmo prompt e dessa vez ele conseguiu me dar uma resposta satisfatória e usável, o problema é que eu teria que ficar copiando e colando os arquivos no projeto, independente de quantos arquivos tivessem sido alterados.

Então de forma bem simplista, funciona? Sim. É possível? Sim. É uma boa opção? Na minha humilde opinião, não.

Coisas bem simples ele consegue resolver mas quando a atividade fica minimamente complexa e tem que gerenciar muitos arquivos ele começa a fazer coisas que não têm o menor sentido, fora o trabalho que dá ter que ficar copiando e colando tudo, até teria como resolver essa parte instalando um agente no terminal e melhorar o desempenho dele colocando um modelo mais inteligente, mas para que essas melhorias resolvessem o problema você gastaria tanto dinheiro que conseguiria pagar um ano completo de Codex e Claude Pro e ficar alternando entre os dois gerenciando os limites.

Acho que é uma experiência válida, aprendi bastante fazendo as pesquisas, tirando dúvidas em blogs e comunidades e instalando tudo localmente e é até legal saber se a sua máquina aguentaria, ver tudo em 100% de uso dá um gostinho legal de teste :), mas para o dia a dia é basicamente um atraso.

Acho que a melhor opção realmente é pagar para aumentar os limites das empresas, no Codex é até legal porque você ganha um reset de limite por semana então para um uso moderado o plano Pro já atende bem, e pensando em upgrade, que é o que estou buscando no momento, acredito que o plano Pro do Claude faça mais sentido, por questão de custo/benefício, o meu uso não é tão alto para pagar 5x mais por isso, mas aí entramos em outro problema, a gestão de contexto, trocar de aplicativo implica em explicar tudo de novo para que você possa continuar o projeto.

Dito isso o meu próximo teste é o AI Memory que o Akita fez. Sei que existem outros projetos que fazem coisas parecidas mas eu não conheço nenhum outro, então esse vai ser o primeiro teste.

Assim que eu tiver uma opinião eu venho aqui relatar a minha experiência.

No mais, cuide da sua saúde, e não deixe de se divertir.
Um abraço.