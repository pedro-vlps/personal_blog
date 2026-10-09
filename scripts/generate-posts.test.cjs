const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parsePost } = require('./generate-posts.cjs');
const source = `---
title: "Meu post"
subtitle: "Um resumo"
category: programacao
date: "2026-10-09"
tags: [react, markdown]
draft: false
---
## Um tópico

**Olá** e [um link](https://example.com).

\`\`\`js
const post = true;
\`\`\`
`;

test('lê os metadados e renderiza Markdown com data estável', () => {
  const post = parsePost(source, 'meu-post.md');
  assert.equal(post.id, 'meu-post');
  assert.equal(post.created_at, '2026-10-09T12:00:00');
  assert.deepEqual(post.tags, ['react', 'markdown']);
  assert.match(post.contentHtml, /<h2>Um tópico<\/h2>/);
  assert.match(post.contentHtml, /<strong>Olá<\/strong>/);
  assert.match(post.contentHtml, /<pre><code class="language-js">/);
});

test('template e rascunhos não são publicados', () => {
  assert.equal(parsePost('texto qualquer', '_template.md'), null);
  assert.equal(parsePost(source.replace('draft: false', 'draft: true'), 'rascunho.md'), null);
});

test('aponta campos ausentes, datas impossíveis e categorias antigas', () => {
  assert.throws(() => parsePost(source.replace('2026-10-09', '2026-02-30'), 'post.md'), /data válida/);
  assert.throws(() => parsePost(source.replace('programacao', 'generalidades'), 'post.md'), /categoria inválida/);
  assert.throws(() => parsePost(source.replace('subtitle: "Um resumo"', 'subtitle: ""'), 'post.md'), /subtitle/);
  assert.throws(() => parsePost(source.replace('react, markdown', '"#react", markdown'), 'post.md'), /hashtags/);
});

test('HTML embutido e links executáveis não são renderizados como código ativo', () => {
  const post = parsePost(source + '\n<script>alert(1)</script>\n[malicioso](javascript:alert(1))', 'post.md');
  assert.doesNotMatch(post.contentHtml, /<script>/);
  assert.doesNotMatch(post.contentHtml, /href="javascript:/);
});
