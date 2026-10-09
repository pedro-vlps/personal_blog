import { useEffect, useRef } from 'react';

export function PostTags({ tags = [] }) {
  if (!tags.length) return null;
  return <ul className="post-tags" aria-label="Hashtags">{tags.map((tag, index) => (
    <li key={`${tag}-${index}`}>#{tag}</li>
  ))}</ul>;
}

export default function PostPage({ post, onBack }) {
  const heading = useRef(null);
  useEffect(() => {
    document.title = post ? `${post.title} · PedroNauta` : 'Post não encontrado · PedroNauta';
    heading.current?.focus();
    return () => { document.title = 'PedroNauta'; };
  }, [post]);

  return (
    <>
      <button type="button" className="back-to-list" onClick={onBack}>← Voltar à lista</button>
      {!post ? <p className="status" role="alert">Post não encontrado.</p> : <article className="post-detail">
        <h1 ref={heading} tabIndex={-1}>{post.title}</h1>
        <p className="detail-subtitle">{post.subtitle}</p>
        <PostTags tags={post.tags} />
        <time dateTime={post.created_at}>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(post.created_at))}</time>
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>}
    </>
  );
}
