import React, { useMemo, useState } from "react";
import { FaHeart, FaRegHeart, FaComment, FaUser } from "react-icons/fa";

export default function SupportFeed() {
  const [newQuestion, setNewQuestion] = useState("");
  const [posts, setPosts] = useState(() => [
    {
      id: 1,
      user: "@builder.alpha",
      content: "Qual melhor forma de validar se um token é honeypot sem gastar muito em taxas?",
      likes: 12,
      liked: false,
      comments: [
        {
          id: 11,
          user: "@pedrodapps",
          text: "Simule transferências com slippage moderada e valide funções restritivas.",
          likes: 5,
          liked: false,
        },
        {
          id: 12,
          user: "@beta.dev",
          text: "Checar se há blacklist/whitelist e taxas dinâmicas no contrato.",
          likes: 2,
          liked: false,
        },
      ],
    },
    {
      id: 2,
      user: "@builder.nova",
      content: "Alguém tem um checklist rápido para rug pull detector?",
      likes: 8,
      liked: false,
      comments: [
        {
          id: 21,
          user: "@security.lab",
          text: "Owner renounced, liquidity bloqueada, taxas razoáveis, sem proxies obscuros.",
          likes: 3,
          liked: false,
        },
      ],
    },
  ]);

  const totalActivity = useMemo(
    () => posts.reduce((acc, p) => acc + p.likes + p.comments.length, 0),
    [posts]
  );

  const addQuestion = () => {
    const text = newQuestion.trim();
    if (!text) return;
    setPosts((prev) => [
      {
        id: Date.now(),
        user: "@você",
        content: text,
        likes: 0,
        liked: false,
        comments: [],
      },
      ...prev,
    ]);
    setNewQuestion("");
  };

  const toggleLikePost = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? Math.max(0, p.likes - 1) : p.likes + 1 }
          : p
      )
    );
  };

  const toggleLikeComment = (postId, commentId) => {
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
  };

  const addComment = (postId, text) => {
    const t = text.trim();
    if (!t) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                { id: Date.now(), user: "@você", text: t, likes: 0, liked: false },
              ],
            }
          : p
      )
    );
  };

  return (
    <section className="support" aria-labelledby="support-title">
      <header className="support__header">
        <h2 id="support-title" className="support__title">
          Suporte da Comunidade
        </h2>
        <div className="support__meta">Atividade recente: {totalActivity}</div>
      </header>

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
              <div className="support__action">
                <FaComment aria-hidden="true" />
                <span>{post.comments.length}</span>
              </div>
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
                </div>
              ))}

              <SupportCommentComposer onSubmit={(text) => addComment(post.id, text)} />
            </div>
          </article>
        ))}
      </div>
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
