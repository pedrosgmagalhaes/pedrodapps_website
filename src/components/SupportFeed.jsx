import React, { useEffect, useMemo, useState } from "react";
import { FaHeart, FaRegHeart, FaComment, FaUser } from "react-icons/fa";
import { API } from "../lib/api";

export default function SupportFeed({ courseSlug = "builders-de-elite", lessonSlug }) {
  const [newQuestion, setNewQuestion] = useState("");
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | ready
  const [cursor, setCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    let mounted = true;
    // Carrega usuário autenticado (se houver) para habilitar exclusão do próprio comentário
    (async () => {
      try {
        const me = await API.auth.me();
        if (!mounted) return;
        if (me && !me.error && me.id) setCurrentUserId(me.id);
      } catch {
        /* ignore */
      }
    })();
    async function loadTopLevel(reset = true) {
      if (!lessonSlug) return;
      setStatus("loading");
      const res = await API.courses.lessons.comments.list(courseSlug, lessonSlug, { limit: 20, cursor: reset ? null : cursor });
      if (!mounted) return;
      if (res?.error) {
        setStatus("error");
        setPosts([]);
      } else {
        const items = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
        const mapped = items.map((c) => ({
          id: c.id,
          user: c.userHandle || "@usuário",
          content: c.content,
          likes: Number(c.likes || 0),
          liked: false,
          comments: [],
          authorId: c.userId || null,
          createdAt: c.createdAt,
        }));
        setPosts(reset ? mapped : [...posts, ...mapped]);
        setHasNextPage(!!res?.pageInfo?.hasNextPage);
        const last = items[items.length - 1];
        setCursor(last ? last.createdAt : null);
        setStatus("ready");
      }
    }
    loadTopLevel(true);
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonSlug, courseSlug]);

  async function handleLoadMore() {
    if (!lessonSlug || !hasNextPage) return;
    setStatus("loading");
    try {
      const res = await API.courses.lessons.comments.list(courseSlug, lessonSlug, {
        limit: 20,
        cursor,
      });
      const items = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
      const mapped = items.map((c) => ({
        id: c.id,
        user: c.userHandle || "@usuário",
        content: c.content,
        likes: Number(c.likes || 0),
        liked: false,
        comments: [],
        createdAt: c.createdAt,
      }));
      setPosts((prev) => [...prev, ...mapped]);
      setHasNextPage(!!res?.pageInfo?.hasNextPage);
      const last = items[items.length - 1];
      setCursor(last ? last.createdAt : null);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  const totalActivity = useMemo(
    () => posts.reduce((acc, p) => acc + p.likes + p.comments.length, 0),
    [posts]
  );

  const addQuestion = async () => {
    const text = newQuestion.trim();
    if (!text) return;
    const res = await API.courses.lessons.comments.create(courseSlug, lessonSlug, { content: text });
    if (res?.error) return;
    const created = res?.comment ?? res;
    setPosts((prev) => [
      {
        id: created?.id || Date.now(),
        user: created?.userHandle || "@você",
        content: created?.content || text,
        likes: Number(created?.likes || 0),
        liked: false,
        comments: [],
        createdAt: created?.createdAt || new Date().toISOString(),
      },
      ...prev,
    ]);
    setNewQuestion("");
  };

  const toggleLikePost = async (postId) => {
    const target = posts.find((p) => p.id === postId);
    if (!target) return;
    try {
      if (target.liked) {
        await API.courses.lessons.comments.reactions.remove(courseSlug, lessonSlug, postId, "like");
      } else {
        await API.courses.lessons.comments.reactions.add(courseSlug, lessonSlug, postId, "like");
      }
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, liked: !p.liked, likes: p.liked ? Math.max(0, p.likes - 1) : p.likes + 1 }
            : p
        )
      );
    } catch {
      // ignore errors for now
    }
  };

  const toggleLikeComment = async (postId, commentId) => {
    const parent = posts.find((p) => p.id === postId);
    if (!parent) return;
    const target = parent.comments.find((c) => c.id === commentId);
    try {
      if (target?.liked) {
        await API.courses.lessons.comments.reactions.remove(courseSlug, lessonSlug, commentId, "like");
      } else {
        await API.courses.lessons.comments.reactions.add(courseSlug, lessonSlug, commentId, "like");
      }
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          return {
            ...p,
            comments: p.comments.map((c) =>
              c.id === commentId
                ? { ...c, liked: !c.liked, likes: c.liked ? Math.max(0, c.likes - 1) : c.likes + 1 }
                : c
            ),
          };
        })
      );
    } catch {
      // ignore errors for now
    }
  };

  const addComment = async (postId, text) => {
    const t = text.trim();
    if (!t) return;
    const res = await API.courses.lessons.comments.create(courseSlug, lessonSlug, {
      content: t,
      parentCommentId: postId,
    });
    if (res?.error) return;
    const created = res?.comment ?? res;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: created?.id || Date.now(),
                  user: created?.userHandle || "@você",
                  text: created?.content || t,
                  likes: Number(created?.likes || 0),
                  liked: false,
                  authorId: created?.userId || currentUserId || null,
                },
              ],
            }
          : p
      )
    );
  };

  const loadReplies = async (postId) => {
    const res = await API.courses.lessons.comments.list(courseSlug, lessonSlug, {
      parentCommentId: postId,
      limit: 20,
    });
    const items = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
    const mapped = items.map((c) => ({ id: c.id, user: c.userHandle || "@usuário", text: c.content, likes: Number(c.likes || 0), liked: false, authorId: c.userId || null }));
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: mapped } : p))
    );
  };

  const deleteTopLevel = async (postId) => {
    try {
      const res = await API.courses.lessons.comments.delete(courseSlug, lessonSlug, postId);
      if (res?.error) return;
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      /* ignore */
    }
  };

  const deleteReply = async (commentId) => {
    try {
      const res = await API.courses.lessons.comments.delete(courseSlug, lessonSlug, commentId);
      if (res?.error) return;
      setPosts((prev) =>
        prev.map((p) => ({
          ...p,
          comments: p.comments.filter((c) => c.id !== commentId),
        }))
      );
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="support" aria-labelledby="support-title">
      <header className="support__header">
        <h2 id="support-title" className="support__title">
          Suporte da Comunidade
        </h2>
        <div className="support__meta">Atividade recente: {totalActivity}</div>
      </header>

      {status === "loading" && (
        <div role="status" aria-live="polite" style={{ marginBottom: 12 }}>
          <span className="skeleton-line" style={{ width: '60%' }} />
          <span className="skeleton-line" style={{ width: '40%', display: 'block', marginTop: 8 }} />
        </div>
      )}
      {status === "error" && (
        <div className="support__meta" role="alert" style={{ marginBottom: 12 }}>
          Não foi possível carregar os comentários agora.
        </div>
      )}

      <div className="support__composer" role="form" aria-label="Nova pergunta">
        <div className="support__composer-user">
          <FaUser aria-hidden="true" /> @você
        </div>
        <textarea
          className="support__composer-input"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Faça sua pergunta para a comunidade..."
          rows={3}
        />
        <div className="support__composer-actions">
          <button type="button" className="support__btn" onClick={addQuestion}>
            Publicar
          </button>
        </div>
      </div>

      <div className="support__list" role="feed">
        {posts.map((post) => (
          <article key={post.id} className="support__post" role="article">
            <header className="support__post-header">
              <div className="support__post-user">
                <FaUser aria-hidden="true" /> {post.user}
              </div>
            </header>
            <div className="support__post-content">{post.content}</div>
            <div className="support__post-actions">
              <button
                type="button"
                className="support__action"
                onClick={() => toggleLikePost(post.id)}
                aria-label="Curtir postagem"
              >
                {post.liked ? (
                  <FaHeart className="support__like is-liked" />
                ) : (
                  <FaRegHeart className="support__like" />
                )}
                <span>{post.likes}</span>
              </button>
              {currentUserId && post.authorId && currentUserId === post.authorId && (
                <button
                  type="button"
                  className="support__action"
                  onClick={() => deleteTopLevel(post.id)}
                  aria-label="Excluir postagem"
                >
                  Excluir
                </button>
              )}
              <button
                type="button"
                className="support__action"
                onClick={() => loadReplies(post.id)}
                aria-label="Carregar comentários"
              >
                <FaComment aria-hidden="true" />
                <span>{post.comments.length}</span>
              </button>
            </div>

            <div className="support__comments" role="list">
              {post.comments.map((c) => (
                <div key={c.id} className="support__comment" role="listitem">
                  <div className="support__comment-head">
                    <span className="support__comment-user">
                      <FaUser aria-hidden="true" /> {c.user}
                    </span>
                    <button
                      type="button"
                      className="support__comment-like"
                      onClick={() => toggleLikeComment(post.id, c.id)}
                      aria-label="Curtir comentário"
                    >
                      {c.liked ? (
                        <FaHeart className="support__like is-liked" />
                      ) : (
                        <FaRegHeart className="support__like" />
                      )}
                      <span>{c.likes}</span>
                    </button>
                  </div>
                <div className="support__comment-text">{c.text}</div>
                {currentUserId && c.authorId && currentUserId === c.authorId && (
                  <div className="support__comment-actions" style={{ marginTop: 6 }}>
                    <button
                      type="button"
                      className="support__btn"
                      onClick={() => deleteReply(c.id)}
                      aria-label="Excluir comentário"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            ))}

              <SupportCommentComposer onSubmit={(text) => addComment(post.id, text)} />
            </div>
          </article>
        ))}
      </div>

      {hasNextPage && status !== "loading" && (
        <div className="support__composer-actions" style={{ marginTop: 12 }}>
          <button type="button" className="support__btn" onClick={handleLoadMore}>
            Carregar mais
          </button>
        </div>
      )}
    </section>
  );
}

function SupportCommentComposer({ onSubmit }) {
  const [text, setText] = useState("");
  return (
    <div className="support__comment-composer">
      <textarea
        className="support__comment-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Adicionar um comentário..."
        rows={2}
      />
      <div className="support__comment-actions">
        <button
          type="button"
          className="support__btn"
          onClick={() => {
            onSubmit?.(text);
            setText("");
          }}
        >
          Comentar
        </button>
      </div>
    </div>
  );
}