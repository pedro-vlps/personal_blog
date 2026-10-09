# Blog pessoal

O projeto ativo está em `personal_blog_front`. O blog é estático e lê as
publicações Markdown de `personal_blog_front/content/posts` durante o build.

```powershell
cd personal_blog_front
npm ci
npm start
```

Copie `content/posts/_template.md`, preencha o cabeçalho e escreva o texto.
Os tópicos são Programação, Investimentos e Jogos. Para publicar, faça commit
dos Markdown e gere o site com `npm run build`; a pasta `build` está pronta para
hospedagem estática. Consulte o README do front para os detalhes.

O backend antigo e a exportação original dos posts foram arquivados em `.legacy`
para preservar código, histórico e conteúdo. Não fazem parte do build nem são
necessários para executar o blog. Os containers antigos foram desligados e o
volume externo do PostgreSQL foi preservado como backup; ele não é mais utilizado.
