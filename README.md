# PedroNauta

Blog pessoal sobre **Programação, Investimentos e Jogos**, desenvolvido para
registrar estudos, experiências e projetos em um lugar próprio.

O conteúdo é escrito em Markdown e versionado neste repositório. Durante o
build, as publicações são convertidas em dados e HTML para uma interface React.
O resultado é um site estático, servido com Nginx em produção, sem API ou banco de dados.

## Funcionalidades

- Publicações organizadas por ano e mês, das mais recentes para as mais antigas.
- Filtros por Programação, Investimentos e Jogos.
- Listagem com data, título, subtítulo e hashtags.
- Página de leitura com suporte a Markdown, código, listas, imagens e tabelas.
- Endereços individuais para compartilhar publicações.
- Tema claro ou escuro, com preferência inicial do dispositivo e escolha salva no navegador.
- Layout responsivo e navegação por teclado.
- Dockerfile com build em etapas e suporte à porta dinâmica do Railway.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| React 19 | Interface e navegação entre lista e publicações |
| JavaScript e CSS | Componentes, comportamento e estilos |
| Markdown + YAML | Texto e metadados das publicações |
| markdown-it | Conversão do Markdown em HTML |
| js-yaml | Leitura dos metadados |
| Jest e Testing Library | Testes da interface e do tema |
| Node.js Test Runner | Testes do gerador de publicações |
| Docker e Nginx | Build e servidor de produção |

O projeto utiliza `react-scripts` para o ambiente de desenvolvimento, testes e build.

## Executar localmente

### Pré-requisitos

- **Node.js 24** e npm, alinhados à versão usada no Dockerfile.
- **Git** para clonar o repositório.
- **Docker**, caso queira executar a imagem de produção localmente.

```bash
git clone https://github.com/pedro-vlps/personal_blog.git
cd personal_blog
npm ci
npm start
```

Acesse [localhost:3000](http://localhost:3000). Os comandos podem ser executados
na raiz do repositório, inclusive no PowerShell. Não é necessário criar um `.env`.

## Escrever uma publicação

Os arquivos ficam em [`content/posts`](content/posts). Para começar, copie
[`_template.md`](content/posts/_template.md) para um novo arquivo na mesma pasta:

```powershell
Copy-Item content/posts/_template.md content/posts/meu-primeiro-post.md
```

Em sistemas com shell Bash:

```bash
cp content/posts/_template.md content/posts/meu-primeiro-post.md
```

Preencha o cabeçalho YAML e escreva o texto abaixo do segundo `---`:

````markdown
---
title: "Meu primeiro post"
subtitle: "Uma apresentação do que quero compartilhar."
category: "programacao"
date: "2026-10-09"
tags:
  - react
  - aprendizado
draft: false
---

Uma introdução ao assunto, com **ênfase** e [links](https://example.com).

## O que aprendi

- Uma descoberta importante.
- Um próximo passo para explorar.

```javascript
const mensagem = 'Olá, mundo!';
console.log(mensagem);
```
````

### Metadados

| Campo | Formato |
| --- | --- |
| `title` | Título da publicação; texto obrigatório |
| `subtitle` | Resumo exibido na listagem; texto obrigatório |
| `category` | `programacao`, `investimentos` ou `jogos` |
| `date` | Data de escrita entre aspas, no formato `YYYY-MM-DD` |
| `tags` | Lista não vazia de hashtags, sem `#` ou espaços |
| `draft` | `true` para rascunho; `false` para publicar |

As hashtags aceitam letras, números, hífens e underscores. O nome do arquivo
funciona como identificador: use letras minúsculas sem acentos, números e hífens.
Por exemplo, `meu-primeiro-post.md` gera o endereço `/#posts/meu-primeiro-post`.
Renomear um arquivo muda o endereço da publicação.

Arquivos começando com `_`, incluindo o template, são ignorados pelo gerador.
Rascunhos com `draft: true` também não entram no site. Se `draft` for omitido,
o arquivo será tratado como uma publicação. A data de escrita é preservada
independentemente do fuso do visitante.

### Imagens e formatação

Para imagens locais, coloque o arquivo em `public/images` e referencie-o no texto:

```markdown
![Descrição da imagem](/images/meu-projeto.png)
```

O Markdown suporta títulos, listas, citações, tabelas e blocos de código.
HTML embutido é desabilitado. O título principal é exibido pela interface;
comece as seções do texto com `##` para evitar repeti-lo.

### Atualizar e publicar

1. Edite o Markdown e confira os metadados.
2. Rode os testes e `npm run build`.
3. Faça commit e push dos arquivos da publicação.
4. Publique o novo build ou aguarde o deploy da branch conectada à hospedagem.

Com o servidor de desenvolvimento aberto, rode `npm run posts:generate` em
outro terminal após editar ou adicionar um Markdown. O React recarrega os dados
gerados. Reiniciar `npm start` também executa a geração.

## Comandos

| Comando | Descrição |
| --- | --- |
| `npm ci` | Instala as dependências conforme o lockfile |
| `npm start` | Gera os posts e inicia o servidor de desenvolvimento |
| `npm run posts:generate` | Atualiza os dados a partir dos Markdown |
| `npm run test:content` | Testa leitura, metadados e renderização do conteúdo |
| `npm test -- --watchAll=false --runInBand` | Executa os testes da interface e do tema |
| `npm run build` | Gera os posts e compila a versão de produção |

## Estrutura do projeto

```text
content/posts/               Publicações Markdown e template
scripts/                     Gerador de publicações e seus testes
src/                         Interface, estilos e testes React
  generated/posts.json       Dados gerados automaticamente; não versionados
public/                      HTML base, favicon e assets públicos
docker/default.conf.template Configuração do Nginx
Dockerfile                   Build React + servidor estático de produção
package.json                 Dependências e comandos
package-lock.json            Versões resolvidas das dependências
```

A geração ocorre antes de `start`, `test` e `build`. O gerador verifica os campos,
ignora templates e rascunhos e produz `src/generated/posts.json`. A interface
importa esse arquivo; nenhuma requisição a uma API é feita para carregar posts.

Não edite o JSON gerado. As pastas `src/generated`, `build`, `node_modules` e os
caches locais são ignorados pelo Git. Os Markdown e o lockfile devem ser versionados.

## Produção com Docker

```bash
docker build -t pedronauta .
docker run --rm -p 8080:8080 -e PORT=8080 pedronauta
```

Acesse [localhost:8080](http://localhost:8080). A etapa de build usa Node.js para
instalar dependências, gerar as publicações e compilar o React. A imagem final
contém Nginx e os arquivos estáticos, sem Node.js ou código de desenvolvimento.

O Nginx escuta em `0.0.0.0` na porta definida por `PORT`, com padrão `8080`.
Para testar outra porta interna:

```bash
docker run --rm -p 8080:9090 -e PORT=9090 pedronauta
```

O HTML usa cache com revalidação; os assets com hash recebem cache de longa duração.

## Deploy no Railway

1. Conecte este repositório a um serviço no Railway.
2. Deixe o **Root Directory** na raiz do repositório.
3. Use o `Dockerfile` detectado pela plataforma, sem substituir os comandos de build e inicialização.
4. Gere um domínio público em **Networking**.
5. Mantenha a branch de publicação conectada para novos deploys após o push.

A variável `PORT` é fornecida pelo Railway e utilizada pelo Nginx. Este projeto
não requer banco, volume persistente ou variáveis de API. O container não configura
chamadas periódicas de health check.

A pasta `build` também pode ser publicada diretamente em uma hospedagem estática.
Os endereços dos posts usam hash, permitindo recarregar links sem configurar
rotas individuais no servidor.

Referências: [Dockerfiles no Railway](https://docs.railway.com/builds/dockerfiles)
e [comando de inicialização](https://docs.railway.com/deployments/start-command).

## Autoria e contribuições

Projeto pessoal de [Pedro Vieira](https://github.com/pedro-vlps).

Sugestões e correções podem ser propostas por issues ou pull requests. Para
alterações de código, execute os testes e o build antes de abrir um PR. As
publicações são mantidas pelo autor e seguem o mesmo fluxo de revisão no Git.
