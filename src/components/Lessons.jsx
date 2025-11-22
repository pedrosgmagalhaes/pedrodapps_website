import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Resources.css";
import { API, withAuth } from "../lib/api";
import { useLocation } from "react-router-dom";
import { collectContextParams } from "../lib/checkoutTelemetry";

export default function Lessons() {
  const location = useLocation();
  const buildCheckoutUrl = () => {
    const base = new URLSearchParams({ course: "builders-de-elite", product: "plan-anual" });
    const src = new URLSearchParams(location.search);
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "ref",
      "origin",
      "gclid",
      "fbclid",
      "lang",
    ].forEach((k) => {
      const v = src.get(k);
      if (v) base.set(k, v);
    });
    const checkoutBase = (
      (import.meta?.env?.VITE_CHECKOUT_BASE_URL ??
        (typeof globalThis !== "undefined" &&
        typeof globalThis["__APP_CHECKOUT_BASE_URL__"] === "string"
          ? globalThis["__APP_CHECKOUT_BASE_URL__"]
          : "")) ||
      `${window.location.origin}/checkout`
    ).trim();
    const extra = collectContextParams();
    Object.entries(extra).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).length > 0) base.set(k, String(v));
    });
    return `${checkoutBase}?${base.toString()}`;
  };
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | ready
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qStatus, setQStatus] = useState("idle"); // idle | loading | error
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadCourse() {
      setStatus("loading");
      const courseSlug = "builders-de-elite";
      const res = await API.courses.get(courseSlug);
      if (!mounted) return;
      if (res?.error) {
        setStatus("error");
        setCourse(null);
        setLessons([]);
      } else {
        setCourse(res);
        // Se não vier lições embutidas, busca via endpoint dedicado
        const list = Array.isArray(res?.lessons)
          ? res.lessons.slice()
          : (await API.courses.lessons.list(courseSlug)) || [];
        list.sort((a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0));
        setLessons(list);
        setStatus("ready");
      }
    }
    loadCourse();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadQuestions() {
      if (!selected?.slug) {
        setQuestions([]);
        return;
      }
      setQStatus("loading");
      const res = await API.edu.lessons.questions.list(selected.slug);
      if (!mounted) return;
      if (res?.error) {
        setQStatus("error");
        setQuestions([]);
      } else {
        setQStatus("idle");
        const list = res?.questions || res?.threads || [];
        setQuestions(Array.isArray(list) ? list : []);
      }
    }
    loadQuestions();
    return () => {
      mounted = false;
    };
  }, [selected?.slug]);

  async function openLesson(slug, locked) {
    if (locked) return;
    setStatus("loading");
    const res = await API.courses.lessons.get("builders-de-elite", slug);
    if (res?.error) {
      setStatus("error");
      setSelected(null);
      return;
    }
    setSelected(res?.lesson ?? res ?? null);
    setStatus("ready");
  }

  async function createQuestion(e) {
    e?.preventDefault?.();
    const title = newTitle.trim();
    const content = newContent.trim();
    if (!selected?.slug || !content) return;
    setQStatus("loading");
    try {
      const api = withAuth();
      const res = await api.post(`/edu/lessons/${selected.slug}/questions`, { title, content });
      if (res?.error) {
        setQStatus("error");
        return;
      }
      setNewTitle("");
      setNewContent("");
      // refresh list
      const listRes = await API.edu.lessons.questions.list(selected.slug);
      const list = listRes?.questions || listRes?.threads || [];
      setQuestions(Array.isArray(list) ? list : []);
      setQStatus("idle");
    } catch {
      setQStatus("error");
    }
  }

  async function toggleLike(threadId, liked) {
    if (!threadId) return;
    try {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === threadId ? { ...q, liked: !liked, likes: (q.likes || 0) + (liked ? -1 : 1) } : q
        )
      );
      const fn = liked ? API.edu.questions.unlike : API.edu.questions.like;
      const res = await fn(threadId);
      if (res?.error) {
        // revert on error
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === threadId ? { ...q, liked, likes: (q.likes || 0) + (liked ? 1 : -1) } : q
          )
        );
      }
    } catch {
      // revert on exception
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === threadId ? { ...q, liked, likes: (q.likes || 0) + (liked ? 1 : -1) } : q
        )
      );
    }
  }

  return (
    <section className="resources" id="lessons" aria-labelledby="lessons-title">
      <div className="resources__container">
        <header className="resources__header">
          <h2 id="lessons-title" className="resources__title">
            {course?.title || "Aulas do curso"}
          </h2>
          <p className="resources__subtitle">
            Conteúdo carregado do backend para o curso Builders de Elite.
          </p>
        </header>

        {status === "loading" && (
          <div className="resources__subtitle" role="status" aria-live="polite">
            Carregando…
          </div>
        )}
        {status === "error" && (
          <div className="resources__subtitle" role="alert">
            Não foi possível carregar as aulas. Tente novamente.
          </div>
        )}

        <div className="resources__list" role="list">
          {lessons.map((item) => (
            <div key={item.slug} className="resources__item" role="listitem">
              <span className="resources__item-title">{item.title}</span>
              {item.locked ? (
                <a className="resources__action" href={buildCheckoutUrl()}>
                  Assinar
                </a>
              ) : (
                <button
                  className="resources__action"
                  onClick={() => openLesson(item.slug, item.locked)}
                >
                  Abrir
                </button>
              )}
            </div>
          ))}
        </div>

        {selected && (
          <div style={{ marginTop: 16 }} aria-live="polite" aria-label="Detalhe da aula">
            <div className="resources__item" role="region" aria-label="Conteúdo da aula">
              <div style={{ display: "grid", gap: 8 }}>
                <strong>{selected.title}</strong>
                {selected.description && <span>{selected.description}</span>}
                {selected.videoUrl || selected.video_url ? (
                  <a
                    className="resources__link"
                    href={selected.videoUrl || selected.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir vídeo
                  </a>
                ) : null}
                {/* Conteúdo em texto, preservando quebras de linha */}
                {selected.content && (
                  <div className="home__md">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} linkTarget="_blank">
                      {selected.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
            <div
              className="resources__item"
              role="region"
              aria-label="Perguntas e respostas"
              style={{ marginTop: 12 }}
            >
              <div style={{ display: "grid", gap: 8 }}>
                <strong>Perguntas e respostas</strong>
                {qStatus === "loading" && (
                  <span className="resources__subtitle" role="status">
                    Carregando Q&A…
                  </span>
                )}
                {qStatus === "error" && (
                  <span className="resources__subtitle" role="alert">
                    Não foi possível carregar o Q&A.
                  </span>
                )}
                <div className="resources__list" role="list">
                  {questions.map((q) => (
                    <div key={q.id} className="resources__item" role="listitem">
                      <span className="resources__item-title">
                        {q.title || q.content || "Pergunta"}
                      </span>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button
                          className="resources__action"
                          onClick={() => toggleLike(q.id, q.liked)}
                          aria-pressed={!!q.liked}
                        >
                          {q.liked ? "Descurtir" : "Curtir"}
                        </button>
                        <span className="resources__subtitle" aria-label="Likes">
                          {q.likes || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={createQuestion}
                  style={{ display: "grid", gap: 8 }}
                  aria-label="Criar pergunta"
                >
                  <input
                    type="text"
                    placeholder="Título (opcional)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    aria-label="Título da pergunta"
                  />
                  <textarea
                    placeholder="Faça sua pergunta para a comunidade..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    aria-label="Conteúdo da pergunta"
                  />
                  <button className="resources__action" type="submit">
                    Publicar
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}