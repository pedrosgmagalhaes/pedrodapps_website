import React, { useEffect, useMemo, useState } from "react";
import "./Home.css";
import { FaRobot, FaPlay, FaDownload, FaLifeRing } from "react-icons/fa";
import WelcomeTerminal from "./WelcomeTerminal";
import BotDownloadInfo from "./BotDownloadInfo";
import SupportFeed from "./SupportFeed";
import { API } from "../lib/api";

export default function Home() {
  const [progress] = useState(80);
  const [open, setOpen] = useState({ lessons: true, bots: true, honeypot: false });
  const [lessonOpenMap, setLessonOpenMap] = useState({});
  const [botVideo, setBotVideo] = useState(false);
  const [activePanel, setActivePanel] = useState("welcome"); // welcome | honeypot_download | lesson_video | lesson_download | lesson_support
  const [showGate, setShowGate] = useState(false);
  const [nowTs, setNowTs] = useState(Date.now());
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonDetail, setLessonDetail] = useState(null);
  const [lessonStatus, setLessonStatus] = useState("idle"); // idle | loading | error
  const releaseOverride = useMemo(() => {
    try {
      return localStorage.getItem("pdapps_release_override") === "true";
    } catch {
      return false;
    }
  }, []);

  const releaseTs = useMemo(() => {
    const now = new Date();
    const rel = new Date(now);
    rel.setDate(now.getDate() + 1);
    rel.setHours(20, 0, 0, 0);
    return rel.getTime();
  }, []);

  const timeLeft = Math.max(0, releaseTs - nowTs);
  const isReleased = releaseOverride || timeLeft === 0;

  useEffect(() => {
    const id = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await API.courses.get("builders-de-elite");
        if (mounted) setCourse(data);
      } catch (err) {
        console.error("Erro ao carregar curso:", err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Abrir colapse da lição via query string (sem navegação externa)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const lesson = params.get("lesson");
      if (lesson) {
        setLessonOpenMap((prev) => ({ ...prev, [lesson]: true }));
        setActiveLesson(lesson);
        setActivePanel("lesson_video");
      }
    } catch {
      // ignora
    }
  }, []);

  // Carregar detalhes da lição quando um painel de lição estiver ativo
  useEffect(() => {
    let mounted = true;
    async function loadDetail() {
      if (!activeLesson || !activePanel?.startsWith("lesson_")) {
        setLessonDetail(null);
        return;
      }
      setLessonStatus("loading");
      try {
        const res = await API.edu.lessons.get(activeLesson);
        if (!mounted) return;
        setLessonDetail(res?.lesson || null);
        setLessonStatus("idle");
      } catch (err) {
        if (!mounted) return;
        setLessonStatus("error");
        setLessonDetail(null);
      }
    }
    loadDetail();
    return () => { mounted = false; };
  }, [activeLesson, activePanel]);

  const formatLeft = (ms) => {
    const total = Math.floor(ms / 1000);
    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const parts = [];
    if (d) parts.push(`${d}d`);
    parts.push(`${String(h).padStart(2, "0")}h`);
    parts.push(`${String(m).padStart(2, "0")}m`);
    parts.push(`${String(s).padStart(2, "0")}s`);
    return parts.join(" ");
  };

  const handleGatedAction = (fn) => {
    if (isReleased) {
      fn();
    } else {
      setShowGate(true);
    }
  };

  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleLesson = (slug) => {
    setLessonOpenMap((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  // Terminal agora é um componente reutilizável (WelcomeTerminal)

  const progressStyle = useMemo(() => ({ "--progress": `${progress}%` }), [progress]);

  return (
    <section className="home" id="home" aria-labelledby="home-title">
      <div className="home__container">
        <header className="home__header">
          <div className="home__brand" role="heading" aria-level={1}>
            <h1 id="home-title" className="home__brand-title">
              <a href="/members/home" aria-label="Voltar para a Home">{course?.title || "Builders de Elite"}</a>
            </h1>
          </div>
        </header>
        <div className="home__layout">
          <aside className="home__sidebar" aria-label="Sidebar navigation">
            <div className="home__sidebar-group">
              <button className="home__sidebar-heading" type="button" onClick={() => toggle("lessons")} aria-expanded={open.lessons}>Aulas</button>
              <div className={`home__collapse ${open.lessons ? "is-open" : ""}`}>
                <div className="home__sidebar-list">
                  {course?.lessons && course.lessons.length > 0 ? (
                    course.lessons
                      .slice()
                      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      .map((lesson) => (
                        <div key={lesson.slug} className="home__sidebar-item-group">
                          <button
                            className="home__sidebar-item"
                            type="button"
                            onClick={() => toggleLesson(lesson.slug)}
                            aria-expanded={!!lessonOpenMap[lesson.slug]}
                            aria-controls={`lesson-${lesson.slug}-collapse`}
                          >
                            <span className="icon"><FaPlay /></span>
                            <span>{lesson.title}</span>
                          </button>
                          <div
                            id={`lesson-${lesson.slug}-collapse`}
                            className={`home__collapse ${lessonOpenMap[lesson.slug] ? "is-open" : ""}`}
                          >
                            <div className="home__sidebar-list home__sublist">
                              <button
                                className="home__sidebar-item"
                                type="button"
                                onClick={() => handleGatedAction(() => { setActiveLesson(lesson.slug); setActivePanel("lesson_video"); })}
                                aria-controls="home-content"
                              >
                                <span className="icon"><FaPlay /></span>
                                <span>Vídeo Aula</span>
                              </button>
                              <button
                                className="home__sidebar-item"
                                type="button"
                                onClick={() => handleGatedAction(() => { setActiveLesson(lesson.slug); setActivePanel("lesson_download"); })}
                                aria-controls="home-content"
                              >
                                <span className="icon"><FaDownload /></span>
                                <span>Download do Bot</span>
                              </button>
                              <button
                                className="home__sidebar-item"
                                type="button"
                                onClick={() => handleGatedAction(() => { setActiveLesson(lesson.slug); setActivePanel("lesson_support"); })}
                                aria-controls="home-content"
                              >
                                <span className="icon"><FaLifeRing /></span>
                                <span>Suporte</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="home__sidebar-item" aria-disabled="true">
                      <span className="icon"><FaPlay /></span>
                      <span>Carregando...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          <div className="home__content">
            <div className="home__progress" aria-label="Lessons progress">
              <div className="home__progress-bar" style={progressStyle}>
                <div className="home__progress-fill" />
              </div>
            </div>
            {activePanel === "welcome" && <WelcomeTerminal title={course?.title ?? undefined} />}
            {activePanel === "honeypot_download" && (
              <BotDownloadInfo
                downloadUrl="/vite.svg"
                onDownload={() => {
                  if (!isReleased) {
                    setShowGate(true);
                    return;
                  }
                  window.open("/vite.svg", "_blank", "noopener,noreferrer");
                }}
              />
            )}
            {activePanel === "support" && <SupportFeed />}

            {activePanel === "lesson_video" && (
              <div className="home__bot-video" role="region" aria-label="Vídeo da aula">
                <div className="home__bot-video-thumb" />
                {lessonStatus === "loading" && (
                  <div className="home__bot-video-caption">Carregando…</div>
                )}
                {lessonStatus === "error" && (
                  <div className="home__bot-video-caption">Não foi possível carregar os detalhes da aula.</div>
                )}
                {lessonStatus === "idle" && (
                  <div className="home__bot-video-caption">
                    {lessonDetail?.video_url ? (
                      <a href={lessonDetail.video_url} target="_blank" rel="noopener noreferrer">Abrir vídeo</a>
                    ) : (
                      "Em breve ficará disponível."
                    )}
                  </div>
                )}
              </div>
            )}

            {activePanel === "lesson_download" && (
              <BotDownloadInfo
                downloadUrl={lessonDetail?.download_url || "/vite.svg"}
                onDownload={() => {
                  if (!isReleased) {
                    setShowGate(true);
                    return;
                  }
                  const url = lessonDetail?.download_url || "/vite.svg";
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
              />
            )}

            {activePanel === "lesson_support" && <SupportFeed />}
          </div>
        </div>
      </div>
      {!isReleased && showGate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="gate-title"
          aria-describedby="gate-desc"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "rgb(var(--bg-primary-rgb) / 88%)",
              border: "1px solid var(--accent-primary)",
              borderRadius: 12,
              padding: 24,
              width: "90%",
              maxWidth: 640,
              color: "#c7ffc0",
              boxShadow: "0 0 0 2px rgba(123,227,61,0.15), 0 12px 28px rgba(0,0,0,0.45)",
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(123,227,61,0.03) 0px, rgba(123,227,61,0.03) 2px, transparent 3px, transparent 6px)",
            }}
          >
            <h2
              id="gate-title"
              style={{
                margin: 0,
                fontSize: 22,
                color: "var(--accent-primary)",
                letterSpacing: 0.4,
              }}
            >
              Em breve disponível
            </h2>
            <p id="gate-desc" style={{ marginTop: 12, marginBottom: 8, opacity: 0.95 }}>
              Este módulo ficará disponível amanhã às 20:00.
            </p>
            <div style={{
              marginTop: 8,
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace",
              fontSize: 20,
              letterSpacing: 0.5,
              color: "var(--accent-primary)",
            }}>
              {formatLeft(timeLeft)}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button
                type="button"
                onClick={() => setShowGate(false)}
                style={{
                  background: "var(--accent-primary)",
                  border: "1px solid var(--accent-primary)",
                  color: "#111",
                  padding: "10px 16px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}