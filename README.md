# Blog pessoal

Blog estático em React. Os posts são arquivos Markdown deste repositório:
nenhuma API, banco de dados ou autenticação é necessária para executar o site.

## Rodar e gerar o site

```powershell
npm ci
npm start
```

O front roda em http://localhost:3000. Para gerar a versão para hospedagem estática:

```powershell
npm run build
```

Publique a pasta `build` em uma hospedagem estática. Cada publicação nova exige
um novo build; um deploy automático conectado ao Git pode fazer isso após o push.
O Dockerfile abaixo está preparado para Railway. O serviço na plataforma e a
conexão com o GitHub precisam ser configurados na sua conta.

## Deploy no Railway

1. Faça commit e push dos arquivos do front, incluindo Dockerfile, `docker`,
   `scripts`, `content`, `src`, `public` e o lockfile.
2. No Railway, crie um serviço a partir do repositório GitHub do front.
3. Se conectar o repositório que contém os dois projetos, configure o Root
   Directory como `/personal_blog_front`. Se o repositório já for o do front,
   deixe o Root Directory no padrão.
4. O Railway detecta o `Dockerfile`. Deixe Build Command e Start Command sem
   substituições: a imagem já compila e inicia o servidor de produção.
5. Em Networking, gere um domínio público. O Nginx escuta em `0.0.0.0` usando
   a variável `PORT` fornecida pelo Railway. Não é preciso configurar banco,
   volume ou variáveis de API.

O build gera os posts a partir dos Markdown e compila o React. A imagem final
contém apenas Nginx e os arquivos estáticos. Novos commits na branch conectada
podem disparar novos deploys com os posts atualizados. Nenhum health check
periódico é configurado na imagem.

Referências: [Dockerfiles no Railway](https://docs.railway.com/builds/dockerfiles)
e [comando de inicialização](https://docs.railway.com/deployments/start-command).

### Testar o container localmente

```powershell
docker build -t personal-blog .
docker run --rm -p 8080:8080 -e PORT=8080 personal-blog
```

Abra http://localhost:8080. Para outra porta interna, passe `PORT` e ajuste o
mapeamento: `docker run --rm -p 8080:9090 -e PORT=9090 personal-blog`.

## Escrever uma publicação

1. Copie `content/posts/_template.md` para `content/posts/nome-do-post.md`.
2. Use um nome único, sem espaços ou acentos: ele será o endereço do post.
3. Preencha `title`, `subtitle`, `category`, `date` e `tags` no cabeçalho YAML.
4. Escreva o texto em Markdown abaixo do segundo `---`.
5. Mude `draft: true` para `draft: false`, confira o site, faça commit e push.

Categorias disponíveis: `programacao`, `investimentos` e `jogos`.
Use `date` no formato `YYYY-MM-DD`: é a data de escrita, preservada independente
do fuso do visitante. Hashtags são uma lista em `tags`, sem `#` e sem espaços.

O template nunca aparece no blog: arquivos começando com `_` são ignorados.
Publicações com `draft: true` também são ignoradas. Os campos dos posts publicados
são conferidos durante a geração para avisar sobre erros de preenchimento.
Isso é uma verificação de formato, sem fluxo de login ou autorização.

Markdown aceita títulos, listas, links, imagens, citações, tabelas e blocos de código.
HTML embutido é desabilitado. Para imagens locais, coloque-as em `public/images`
e use `![Descrição](/images/arquivo.png)` no texto.

A geração acontece antes de `npm start`, `npm test` e `npm run build`. Se editar
os Markdown com o servidor aberto, rode `npm run posts:generate` em outro terminal
ou reinicie o servidor. Não edite `src/generated/posts.json`: é um arquivo gerado
que não deve ser versionado.

## Interface

O header reúne o logo, Programação, Investimentos, Jogos e o switch de tema.
Os tópicos filtram a lista; o logo mostra todos os posts. A lista é agrupada por
ano e mês, do mais recente para o mais antigo, e mostra data, título, subtítulo e hashtags.
Clicar abre a publicação completa em `/#posts/nome-do-post`, com suporte a
recarregar a página, compartilhar o endereço e voltar pelo histórico do navegador.
Voltar à lista preserva a seção selecionada.

O tema segue inicialmente o dispositivo; sem preferência usa escuro. A escolha
manual feita pelo switch fica salva no navegador.

## Testes

```powershell
npm run test:content
npm test -- --watchAll=false --runInBand
npm run build
```

A publicação depende das permissões de escrita no repositório e de acesso ao deploy.
Os visitantes recebem apenas os arquivos estáticos gerados.
