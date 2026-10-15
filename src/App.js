import { useEffect, useState } from 'react';
import './App.css';
import useTheme from './useTheme';
import PostPage, { PostTags } from './PostPage';
import publishedPosts from './generated/posts.json';

const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' });
const monthFormat = new Intl.DateTimeFormat('pt-BR', { month: 'long' });
const currentPostId = () => window.location.hash.match(/^#posts\/([^/]+)$/)?.[1] || null;
const sections = [
  { id: 'programacao', label: 'Programação' },
  { id: 'investimentos', label: 'Investimentos' },
  { id: 'jogos', label: 'Jogos' },
  { id: 'futebol', label: 'Futebol' },
];

function App({ posts = publishedPosts }) {
  const [, changeTheme, activeTheme] = useTheme();
  const [section, setSection] = useState(null);
  const [selectedId, setSelectedId] = useState(currentPostId);
  const visiblePosts = section ? posts.filter(post => post.category === section) : posts;
  const yearGroups = [];
  [...visiblePosts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).forEach(post => {
    const date = new Date(post.created_at);
    const year = date.getFullYear();
    let yearGroup = yearGroups[yearGroups.length - 1];
    if (!yearGroup || yearGroup.year !== year) {
      yearGroup = { year, months: [] };
      yearGroups.push(yearGroup);
    }
    const key = `${year}-${date.getMonth()}`;
    let group = yearGroup.months[yearGroup.months.length - 1];
    if (!group || group.key !== key) {
      group = { key, label: monthFormat.format(date), posts: [] };
      yearGroup.months.push(group);
    }
    group.posts.push(post);
  });

  useEffect(() => {
    const syncPage = () => setSelectedId(currentPostId());
    window.addEventListener('popstate', syncPage);
    window.addEventListener('hashchange', syncPage);
    return () => {
      window.removeEventListener('popstate', syncPage);
      window.removeEventListener('hashchange', syncPage);
    };
  }, []);

  function navigate(id = null) {
    window.history.pushState(null, '', id ? `#posts/${id}` : window.location.pathname + window.location.search);
    setSelectedId(id);
  }


  return (
    <div className="blog">
      <header className="blog-header">
        <div className="header-inner">
          <a className="blog-logo" href="/" aria-label="PedroNauta — todos os posts" onClick={event => { event.preventDefault(); setSection(null); navigate(); }}>
            <svg viewBox="0 0 32 32" width="32" height="32" fill="none" aria-hidden="true">
              <path d="M16 8C12 5 7 5 3 6v20c4-1 9-1 13 2 4-3 9-3 13-2V6c-4-1-9-1-13 2Zm0 0v20" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <span>PedroNauta</span>
          </a>
          <nav className="blog-topics" aria-label="Seções do blog">
            {sections.map(topic => (
              <button key={topic.id} type="button" aria-pressed={section === topic.id} onClick={() => { setSection(topic.id); navigate(); }}>
                {topic.label}
              </button>
            ))}
          </nav>
          <div className="header-actions">
            <a className="github-link" href="https://github.com/pedro-vlps" target="_blank" rel="noopener noreferrer" aria-label="GitHub de Pedro (abre em outra aba)" title="GitHub de Pedro">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M12 .75a11.25 11.25 0 0 0-3.558 21.923c.563.104.77-.244.77-.543 0-.267-.01-.975-.015-1.914-3.13.68-3.791-1.508-3.791-1.508-.512-1.3-1.25-1.646-1.25-1.646-1.022-.699.078-.685.078-.685 1.13.08 1.725 1.16 1.725 1.16 1.005 1.722 2.638 1.225 3.28.937.103-.729.394-1.225.716-1.507-2.499-.284-5.126-1.25-5.126-5.565 0-1.23.44-2.233 1.16-3.02-.116-.285-.503-1.43.11-2.98 0 0 .945-.303 3.094 1.154A10.78 10.78 0 0 1 12 6.178c.956.005 1.92.13 2.82.38 2.148-1.457 3.09-1.154 3.09-1.154.616 1.55.229 2.695.113 2.98.722.787 1.158 1.79 1.158 3.02 0 4.325-2.631 5.278-5.138 5.557.404.35.765 1.042.765 2.1 0 1.516-.014 2.74-.014 3.112 0 .302.203.652.775.542A11.25 11.25 0 0 0 12 .75Z" />
              </svg>
            </a>
            <button
              type="button"
              className="theme-switch"
              role="switch"
              aria-checked={activeTheme === 'dark'}
              aria-label="Modo escuro"
              title="Modo escuro"
              onClick={() => changeTheme(activeTheme === 'dark' ? 'light' : 'dark')}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.9 13.1A9 9 0 0 1 10.9 3.1a9 9 0 1 0 10 10Z" />
              </svg>
              <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
            </button>
          </div>
        </div>
      </header>
      <main className="blog-main" aria-label={section ? sections.find(topic => topic.id === section).label : 'Todos os posts'}>
        {selectedId ? <PostPage post={posts.find(post => post.id === selectedId)} onBack={() => navigate()} /> : <>
        {visiblePosts.length === 0 && (
          <div className="status">
            <p>Ainda não há posts nesta seção.</p>
          </div>
        )}
        {visiblePosts.length > 0 && (
          <div className="year-groups">
            {yearGroups.map(yearGroup => (
            <section className="year-group" key={yearGroup.year} aria-labelledby={`year-${yearGroup.year}`}>
              <h2 className="year-heading" id={`year-${yearGroup.year}`}>{yearGroup.year}</h2>
            {yearGroup.months.map(group => (
            <section className="month-group" key={group.key} aria-labelledby={`month-${group.key}`}>
              <h3 className="month-heading" id={`month-${group.key}`}>{group.label}</h3>
              <ul className="post-list">
            {group.posts.map(post => (
              <li key={post.id}>
                <article className="post">
                  <a className="post-summary" href={`#posts/${post.id}`} onClick={event => {
                    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                    event.preventDefault(); navigate(post.id);
                  }}>
                    <time dateTime={post.created_at}>{dateFormat.format(new Date(post.created_at))}</time>
                    <h4>{post.title}</h4>
                    {post.subtitle && <p className="post-subtitle">{post.subtitle}</p>}
                    <PostTags tags={post.tags} />
                  </a>
                </article>
              </li>
            ))}
              </ul>
            </section>
            ))}
            </section>
            ))}
          </div>
        )}
        </>}
      </main>
    </div>
  );
}
export default App;
