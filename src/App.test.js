import { act, fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import publishedPosts from './generated/posts.json';

const fixtures = [
  { id: 'jogo', title: 'Um jogo', subtitle: 'Uma descoberta', tags: ['jogos'], contentHtml: '<p>Texto completo sobre jogos.</p>', category: 'jogos', created_at: '2026-10-09T12:00:00' },
  { id: 'codigo', title: 'Código', subtitle: 'Um projeto', tags: ['react'], contentHtml: '<h2>Como começar</h2><p>Texto completo de programação.</p><pre><code>const blog = true;</code></pre>', category: 'programacao', created_at: '2026-09-15T12:00:00' },
  { id: 'estudos', title: 'Estudos', subtitle: 'Anotações', tags: ['financas'], contentHtml: '<p>Texto completo de estudos.</p>', category: 'investimentos', created_at: '2025-09-15T12:00:00' },
];

beforeEach(() => { localStorage.clear(); window.history.replaceState(null, '', '/'); });
afterEach(() => { localStorage.clear(); });

test('lista o conteúdo real gerado sem publicar o template', () => {
  render(<App />);
  expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(6);
  expect(publishedPosts.every(post => ['programacao', 'investimentos', 'jogos'].includes(post.category))).toBe(true);
  expect(screen.queryByText('Título da publicação')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Generalidades' })).not.toBeInTheDocument();
});

test('agrupa por ano e mês, inclusive meses iguais de anos diferentes', () => {
  render(<App posts={fixtures} />);
  expect(screen.getAllByRole('heading', { level: 2 }).map(heading => heading.textContent)).toEqual(['2026', '2025']);
  expect(screen.getAllByRole('heading', { level: 3 }).map(heading => heading.textContent)).toEqual(['outubro', 'setembro', 'setembro']);
});

test('os tópicos filtram posts e o logo retorna à lista completa', () => {
  render(<App posts={fixtures} />);
  for (const [label, title] of [['Jogos', 'Um jogo'], ['Programação', 'Código'], ['Investimentos', 'Estudos']]) {
    fireEvent.click(screen.getByRole('button', { name: label }));
    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(1);
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  }
  fireEvent.click(screen.getByRole('link', { name: 'Blog pessoal — todos os posts' }));
  expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(3);
});

test('o resumo mostra data, título, subtítulo e hashtags sem o texto completo', () => {
  render(<App posts={fixtures} />);
  const summary = screen.getByRole('link', { name: /Um jogo/ });
  expect(within(summary).getByText('9 de outubro de 2026')).toBeInTheDocument();
  expect(within(summary).getByText('Uma descoberta')).toBeInTheDocument();
  expect(within(summary).getByText('#jogos')).toBeInTheDocument();
  expect(screen.queryByText('Texto completo sobre jogos.')).not.toBeInTheDocument();
});

test('abre Markdown formatado e volta preservando a seção', () => {
  render(<App posts={fixtures} />);
  fireEvent.click(screen.getByRole('button', { name: 'Programação' }));
  fireEvent.click(screen.getByRole('link', { name: /Código/ }));
  expect(screen.getByText('Texto completo de programação.')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Como começar', level: 2 })).toBeInTheDocument();
  expect(screen.getByText('const blog = true;').tagName).toBe('CODE');
  expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
  expect(window.location.hash).toBe('#posts/codigo');
  fireEvent.click(screen.getByRole('button', { name: /Voltar à lista/ }));
  expect(screen.queryByText('Texto completo de programação.')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Programação' })).toHaveAttribute('aria-pressed', 'true');
});

test('abre post diretamente e acompanha a navegação do histórico', () => {
  window.history.replaceState(null, '', '/#posts/codigo');
  render(<App posts={fixtures} />);
  expect(screen.getByRole('heading', { level: 1, name: 'Código' })).toBeInTheDocument();
  act(() => {
    window.history.replaceState(null, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(3);
});

test('trata post inexistente e lista vazia', () => {
  window.history.replaceState(null, '', '/#posts/inexistente');
  render(<App posts={[]} />);
  expect(screen.getByRole('alert')).toHaveTextContent('Post não encontrado.');
  fireEvent.click(screen.getByRole('button', { name: /Voltar à lista/ }));
  expect(screen.getByText('Ainda não há posts nesta seção.')).toBeInTheDocument();
});

test('switch salva a escolha de tema', () => {
  render(<App posts={[]} />);
  const themeSwitch = screen.getByRole('switch', { name: 'Modo escuro' });
  expect(themeSwitch).toHaveAttribute('aria-checked', 'true');
  fireEvent.click(themeSwitch);
  expect(themeSwitch).toHaveAttribute('aria-checked', 'false');
  expect(localStorage.getItem('blog-theme')).toBe('light');
});
