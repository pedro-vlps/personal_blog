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
          <button
            type="button"
            className="theme-switch"
            role="switch"
            aria-checked={activeTheme === 'dark'}
            aria-label="Modo escuro"
            onClick={() => changeTheme(activeTheme === 'dark' ? 'light' : 'dark')}
          >
            <span>Modo escuro</span>
            <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
          </button>
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
