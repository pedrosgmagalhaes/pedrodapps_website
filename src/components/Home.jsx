import React, { useEffect, useMemo, useState } from "react";
import "./Home.css";
import { FaRobot, FaPlay, FaDownload, FaLifeRing } from "react-icons/fa";
import WelcomeTerminal from "./WelcomeTerminal";
import BotDownloadInfo from "./BotDownloadInfo";
import SupportFeed from "./SupportFeed";

export default function Home() {
  const [progress] = useState(80);
  const [open, setOpen] = useState({ bots: true, honeypot: false });
  const [botVideo, setBotVideo] = useState(false);
  const [activePanel, setActivePanel] = useState("welcome"); // welcome | honeypot_download
  const [showGate, setShowGate] = useState(false);
  const [nowTs, setNowTs] = useState(Date.now());

  const releaseTs = useMemo(() => {
    const now = new Date();
    const rel = new Date(now);
    rel.setDate(now.getDate() + 1);
    rel.setHours(20, 0, 0, 0);
    return rel.getTime();
  }, []);

  const timeLeft = Math.max(0, releaseTs - nowTs);
  const isReleased = timeLeft === 0;

  useEffect(() => {
    const id = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

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

  // Terminal agora é um componente reutilizável (WelcomeTerminal)

  const progressStyle = useMemo(() => ({ "--progress": `${progress}%` }), [progress]);

  return (
    <section className="home" id="home" aria-labelledby="home-title">
      <div className="home__container">
        <header className="home__header">
          <div className="home__brand" role="heading" aria-level={1}>
            <h1 id="home-title" className="home__brand-title">
              <a href="/home" aria-label="Voltar para a Home">Builders de Elite</a>
            </h1>
          </div>
        </header>
        <div className="home__layout">
          <aside className="home__sidebar" aria-label="Sidebar navigation">
            <div className="home__sidebar-group">
              <button className="home__sidebar-heading" type="button" onClick={() => toggle("bots")} aria-expanded={open.bots}>Bots</button>
              <div className={`home__collapse ${open.bots ? "is-open" : ""}`}>
                <div className="home__sidebar-list">
                  <button className="home__sidebar-item" type="button" onClick={() => toggle("honeypot")} aria-expanded={open.honeypot} aria-controls="honeypot-collapse">
                    <span className="icon"><FaRobot /></span>
                    <span>Honeypot & Rug Pull Detector</span>
                  </button>

                  {/* Sub-colapse para o bot Honeypot */}
                  <div id="honeypot-collapse" className={`home__collapse ${open.honeypot ? "is-open" : ""}`}>
                    <div className="home__bot-title">Honeypot & Rug Pull Detector</div>
                    <div className="home__sidebar-list home__sublist">
                  <button className="home__sidebar-item" type="button" onClick={() => handleGatedAction(() => setBotVideo((v) => !v))} aria-expanded={botVideo} aria-controls="honeypot-video">
                    <span className="icon"><FaPlay /></span>
                    <span>Vídeo Aula</span>
                  </button>
                  <button
                    className="home__sidebar-item"
                    type="button"
                    onClick={() => handleGatedAction(() => setActivePanel("honeypot_download"))}
                    aria-controls="home-content"
                  >
                    <span className="icon"><FaDownload /></span>
                    <span>Download do Bot</span>
                  </button>
                  <button className="home__sidebar-item" type="button" onClick={() => handleGatedAction(() => setActivePanel("support"))} aria-controls="home-content">
                    <span className="icon"><FaLifeRing /></span>
                    <span>Suporte</span>
                  </button>
                    </div>

                    {botVideo && (
                      <div id="honeypot-video" className="home__bot-video" role="region" aria-label="Vídeo da aula">
                        <div className="home__bot-video-thumb" />
                        <div className="home__bot-video-caption">Em breve ficará disponível.</div>
                      </div>
                    )}
                  </div>
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
            {activePanel === "welcome" && <WelcomeTerminal />}
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