import React, { useEffect, useMemo, useState } from "react";
import "./Home.css";
import { FaRobot, FaPlay, FaDownload, FaLifeRing, FaBook } from "react-icons/fa";
import WelcomeTerminal from "./WelcomeTerminal";
import BotDownloadInfo from "./BotDownloadInfo";
import SupportFeed from "./SupportFeed";
import { API } from "../lib/api";
import { useTranslation } from "react-i18next";

export default function Home() {
  const [progress] = useState(80);
  const [open, setOpen] = useState({ lessons: true, bots: true, honeypot: false });
  const [lessonOpenMap, setLessonOpenMap] = useState({});
  const [activePanel, setActivePanel] = useState("welcome"); // welcome | honeypot_download | lesson_video | lesson_download | lesson_support
  // Gating removido: não usamos overlay de liberação
  // Countdown removido
  const [course, setCourse] = useState(null);
  const [courseStatus, setCourseStatus] = useState("loading"); // loading | ready | error
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonDetail, setLessonDetail] = useState(null);
  const [lessonStatus, setLessonStatus] = useState("idle"); // idle | loading | error
  const { t } = useTranslation();

  const featureIcons = {
    video: FaPlay,
    botDownload: FaDownload,
    support: FaLifeRing,
    terminal: FaRobot,
    textContent: FaBook,
  };

  const featurePanels = {
    video: "lesson_video",
    botDownload: "lesson_download",
    support: "lesson_support",
    terminal: "lesson_terminal",
    textContent: "lesson_text",
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setCourseStatus("loading");
        const data = await API.courses.get("builders-de-elite");
        if (mounted) {
          setCourse(data);
          setCourseStatus("ready");
        }
      } catch (err) {
        console.error("Erro ao carregar curso:", err);
        if (mounted) setCourseStatus("error");
      }
    })();
    return () => {
      mounted = false;
    };
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
      } catch {
        if (!mounted) return;
        setLessonStatus("error");
        setLessonDetail(null);
      }
    }
    loadDetail();
    return () => {
      mounted = false;
    };
  }, [activeLesson, activePanel]);

  // Função de countdown removida

  const handleGatedAction = (fn) => {
    // Gating removido: aciona a ação diretamente
    fn();
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
              <a href="/members/home" aria-label="Voltar para a Home">
                {course?.title || "Builders de Elite"}
              </a>
            </h1>
          </div>
        </header>
        <div className="home__layout">
          <aside className="home__sidebar" aria-label="Sidebar navigation">
            <div className="home__sidebar-group">
              <button
                className="home__sidebar-heading"
                type="button"
                onClick={() => toggle("lessons")}
                aria-expanded={open.lessons}
              >
                Aulas
              </button>
              <div className={`home__collapse ${open.lessons ? "is-open" : ""}`}>
                <div className="home__sidebar-list">
                  {courseStatus === "loading" ? (
                    <>
                      {[0,1,2].map((i) => (
                        <div key={`skeleton-${i}`} className="home__sidebar-item" aria-disabled="true">
                          <span className="icon">
                            <FaPlay />
                          </span>
                          <span className="skeleton-line" style={{ width: i===0? '60%' : i===1? '48%' : '36%' }} />
                        </div>
                      ))}
                    </>
                  ) : courseStatus === "error" ? (
                    <div className="home__sidebar-item" aria-disabled="true" role="status" aria-live="polite">
                      <span className="icon">
                        <FaPlay />
                      </span>
                      <span>Não foi possível carregar as aulas.</span>
                    </div>
                  ) : course?.lessons && course.lessons.length > 0 ? (
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
                            <span className="icon">
                              <FaPlay />
                            </span>
                            <span>{lesson.title}</span>
                          </button>
                          <div
                            id={`lesson-${lesson.slug}-collapse`}
                            className={`home__collapse ${lessonOpenMap[lesson.slug] ? "is-open" : ""}`}
                          >
                            <div className="home__sidebar-list home__sublist">
                              {lesson.availableFeatures?.map((feat) => {
                                const Icon = featureIcons[feat] || FaPlay; // Default to FaPlay if no icon
                                return (
                                  <button
                                    key={feat}
                                    className="home__sidebar-item"
                                    type="button"
                                    onClick={() =>
                                      handleGatedAction(() => {
                                        setActiveLesson(lesson.slug);
                                        setActivePanel(featurePanels[feat]);
                                      })
                                    }
                                    aria-controls="home-content"
                                  >
                                    <span className="icon">
                                      <Icon />
                                    </span>
                                    <span>{t(`features.${feat}`)}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="home__sidebar-item" aria-disabled="true">
                      <span className="icon">
                        <FaPlay />
                      </span>
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
                  <div className="home__bot-video-caption">
                    Não foi possível carregar os detalhes da aula.
                  </div>
                )}
                {lessonStatus === "idle" && (
                  <div className="home__bot-video-caption">
                    {lessonDetail?.video_url ? (
                      <a href={lessonDetail.video_url} target="_blank" rel="noopener noreferrer">
                        Abrir vídeo
                      </a>
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
                  const url = lessonDetail?.download_url || "/vite.svg";
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
              />
            )}

            {activePanel === "lesson_support" && <SupportFeed />}

            {activePanel === "lesson_terminal" && (
              <div className="home__bot-video" role="region" aria-label={t("features.terminal")}>
                <div className="home__bot-video-caption">
                  {lessonStatus === "loading" && <div>{t("loading")}</div>}
                  {lessonStatus === "error" && <div>{t("error_loading_lesson")}</div>}
                  {lessonStatus === "idle" && (
                    <>
                      {lessonDetail?.terminal_url ? (
                        <a
                          href={lessonDetail.terminal_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("open_terminal")}
                        </a>
                      ) : (
                        t("terminal_coming_soon")
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {activePanel === "lesson_text" && (
              <div className="home__bot-video" role="region" aria-label={t("features.textContent")}>
                <div className="home__bot-video-caption">
                  {lessonStatus === "loading" && <div>{t("loading")}</div>}
                  {lessonStatus === "error" && <div>{t("error_loading_lesson")}</div>}
                  {lessonStatus === "idle" && (
                    <>
                      {lessonDetail?.content ? (
                        <p>{lessonDetail.content}</p>
                      ) : (
                        t("text_content_coming_soon")
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Gating removido: aulas sempre disponíveis */}
    </section>
  );
}