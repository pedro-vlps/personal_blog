const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const MarkdownIt = require('markdown-it');

const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true });
const categories = new Set(['programacao', 'investimentos', 'jogos', 'futebol']);

function parsePost(source, filename) {
  if (path.basename(filename).startsWith('_')) return null;
  const match = source.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) throw new Error(`${filename}: cabeçalho YAML ausente.`);
  const meta = yaml.load(match[1], { schema: yaml.JSON_SCHEMA });
  if (meta?.draft === true) return null;
  for (const field of ['title', 'subtitle', 'date']) {
    if (typeof meta?.[field] !== 'string' || !meta[field].trim()) {
      throw new Error(`${filename}: preencha ${field}.`);
    }
  }
  if (!categories.has(meta.category)) throw new Error(`${filename}: categoria inválida.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date) || Number.isNaN(Date.parse(meta.date)) ||
      new Date(meta.date).toISOString().slice(0, 10) !== meta.date) {
    throw new Error(`${filename}: date deve ser uma data válida no formato YYYY-MM-DD.`);
  }
  if (!Array.isArray(meta.tags) || !meta.tags.length || meta.tags.some(tag => typeof tag !== 'string' || !/^[\p{L}\p{N}_-]+$/u.test(tag))) {
    throw new Error(`${filename}: tags deve ser uma lista de hashtags sem # ou espaços.`);
  }
  if (!match[2].trim()) throw new Error(`${filename}: escreva o texto do post.`);
  const id = path.basename(filename, '.md');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error(`${filename}: use um nome de arquivo sem espaços ou acentos.`);
  return {
    id, title: meta.title.trim(), subtitle: meta.subtitle.trim(), category: meta.category,
    tags: [...new Set(meta.tags)], created_at: `${meta.date}T12:00:00`,
    contentHtml: markdown.render(match[2].trim()),
  };
}

function generate() {
  const root = path.resolve(__dirname, '..');
  const directory = path.join(root, 'content', 'posts');
  const posts = fs.readdirSync(directory).filter(file => file.endsWith('.md')).sort()
    .map(file => parsePost(fs.readFileSync(path.join(directory, file), 'utf8'), file)).filter(Boolean)
    .sort((a, b) => b.created_at.localeCompare(a.created_at) || a.id.localeCompare(b.id));
  const output = path.join(root, 'src', 'generated');
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, 'posts.json'), JSON.stringify(posts, null, 2) + '\n');
  console.log(`${posts.length} publicações geradas a partir de Markdown.`);
}

if (require.main === module) generate();
module.exports = { parsePost };
