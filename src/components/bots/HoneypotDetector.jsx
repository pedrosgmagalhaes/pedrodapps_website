import React, { useMemo, useEffect, useState } from "react";
import { API } from "../../lib/api";
import "./Bots.css";
import { FaPlay, FaDownload, FaLifeRing, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaShieldAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function HoneypotDetector() {
  const location = useLocation();
  const buildCheckoutUrl = () => {
    const base = new URLSearchParams({ course: "builders-de-elite", product: "plan-anual" });
    const src = new URLSearchParams(location.search);
    ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","ref","origin","gclid","fbclid","lang"].forEach((k) => {
      const v = src.get(k);
      if (v) base.set(k, v);
    });
    const checkoutBase = (
      (import.meta?.env?.VITE_CHECKOUT_BASE_URL ??
        (typeof globalThis !== "undefined" && typeof globalThis["__APP_CHECKOUT_BASE_URL__"] === "string"
          ? globalThis["__APP_CHECKOUT_BASE_URL__"]
          : "")) || `${window.location.origin}/checkout`
    ).trim();
    return `${checkoutBase}?${base.toString()}`;
  };
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("Ethereum");
  const [slippage, setSlippage] = useState(10);
  const [results, setResults] = useState(null);
  const [moduleInfo, setModuleInfo] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [showGate, setShowGate] = useState(false);
  const [releaseAt] = useState(() => {
    const now = new Date();
    const rel = new Date(now);
    rel.setDate(now.getDate() + 1);
    rel.setHours(20, 0, 0, 0); // amanhã às 20:00
    return rel.getTime();
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = Math.max(0, releaseAt - Date.now());
    const days = Math.floor(diff / (24 * 3600e3));
    const hours = Math.floor((diff % (24 * 3600e3)) / 3600e3);
    const minutes = Math.floor((diff % 3600e3) / 60e3);
    const seconds = Math.floor((diff % 60e3) / 1e3);
    return { days, hours, minutes, seconds, expired: diff <= 0 };
  });

  useEffect(() => {
    let mounted = true;
    async function loadModule() {
      const res = await API.edu.modules.get("honeypot-rugpull-detector");
      if (!mounted) return;
      if (!res?.error) {
        setModuleInfo(res?.module || res);
        const materials = res?.module?.materials || res?.materials || [];
        const candidate = Array.isArray(materials)
          ? materials.find((m) => m?.url)
          : null;
        setDownloadUrl(candidate?.url || "");
      }
    }
    loadModule();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const diff = Math.max(0, releaseAt - Date.now());
      const days = Math.floor(diff / (24 * 3600e3));
      const hours = Math.floor((diff % (24 * 3600e3)) / 3600e3);
      const minutes = Math.floor((diff % 3600e3) / 60e3);
      const seconds = Math.floor((diff % 60e3) / 1e3);
      setTimeLeft({ days, hours, minutes, seconds, expired: diff <= 0 });
      if (diff <= 0) {
        setShowGate(false);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [releaseAt]);

  const isBeforeRelease = () => Date.now() < releaseAt;
  const handleGateClick = (e, proceed) => {
    if (isBeforeRelease()) {
      e?.preventDefault?.();
      setShowGate(true);
    } else if (typeof proceed === "function") {
      proceed();
    }
  };

  const runAnalysis = () => {
    if (isBeforeRelease()) {
      setShowGate(true);
      return;
    }
    const addr = address.trim();
    if (!addr) {
      setResults({ error: "Please enter a token address." });
      return;
    }
    // Simulated heuristics
    const simulated = {
      network,
      tradeAllowed: true,
      sellTax: slippage + 2,
      transferOk: slippage <= 12,
      blacklistFunctions: addr.length % 2 === 0,
      ownerRenounced: addr.startsWith("0x00"),
      warnings: slippage > 15 ? ["High slippage may hide malicious fees"] : [],
    };
    setResults(simulated);
  };

  const headerTitle = useMemo(() => "Honeypot & Rug Pull Detector", []);

  return (
    <section className="bot" id="bot-honeypot" aria-labelledby="bot-title">
      <div className="bot__container">
        <div className="bot__layout">
          <aside className="bot__sidebar" aria-label="Bot resources">
            <div className="bot__title" id="bot-title">{headerTitle}</div>
            <div className="bot__sidebar-list">
              <a className="bot__sidebar-item" href="/lessons" onClick={(e) => handleGateClick(e, () => { window.location.href = "/lessons"; })}>
                <span className="icon"><FaPlay /></span>
                <span>Video Lesson</span>
                <span className="action">Open</span>
              </a>
              {isBeforeRelease() ? (
                <button className="bot__sidebar-item" type="button" onClick={(e) => handleGateClick(e)}>
                  <span className="icon"><FaDownload /></span>
                  <span>Download Bot</span>
                  <span className="action">Em breve</span>
                </button>
              ) : moduleInfo?.locked ? (
                <a className="bot__sidebar-item" href={buildCheckoutUrl()}>
                  <span className="icon"><FaDownload /></span>
                  <span>Download Bot</span>
                  <span className="action">Assinar</span>
                </a>
              ) : downloadUrl ? (
                <a className="bot__sidebar-item" href={downloadUrl} download>
                  <span className="icon"><FaDownload /></span>
                  <span>Download Bot</span>
                  <span className="action">Download</span>
                </a>
              ) : null}
              <a className="bot__sidebar-item" href="/links">
                <span className="icon"><FaLifeRing /></span>
                <span>Support</span>
                <span className="action">Open</span>
              </a>
            </div>
          </aside>

          <div className="bot__content" role="region" aria-label="Simulation">
            <div className="bot__content-header">
              <div className="bot__content-title">Simulator</div>
              <div className="bot__actions">
                <button className="bot__btn" type="button" onClick={runAnalysis}>Run</button>
              </div>
            </div>

            <div className="bot__body">
              <form className="bot__form" onSubmit={(e) => { e.preventDefault(); runAnalysis(); }}>
                <input className="bot__input" type="text" placeholder="Token address (0x...)" value={address} onChange={(e) => setAddress(e.target.value)} aria-label="Token address" />
                <select className="bot__select" value={network} onChange={(e) => setNetwork(e.target.value)} aria-label="Network">
                  <option>Ethereum</option>
                  <option>BSC</option>
                  <option>Polygon</option>
                  <option>Arbitrum</option>
                </select>
                <input className="bot__input" type="number" min="0" max="100" step="1" value={slippage} onChange={(e) => setSlippage(Number(e.target.value))} aria-label="Slippage (%)" />
                <button className="bot__run" type="submit">Analyze</button>
              </form>

              {results && (
                <div className="bot__results" aria-live="polite">
                  {results.error ? (
                    <div className="bot__result-item">
                      <FaExclamationTriangle className="warn" />
                      <span>{results.error}</span>
                    </div>
                  ) : (
                    <>
                      <div className="bot__result-item">
                        <FaShieldAlt className="ok" />
                        <span>Network</span>
                        <strong>{results.network}</strong>
                      </div>
                      <div className="bot__result-item">
                        {results.tradeAllowed ? <FaCheckCircle className="ok" /> : <FaTimesCircle className="err" />}
                        <span>Trade allowed</span>
                      </div>
                      <div className="bot__result-item">
                        {(results.sellTax ?? 0) < 20 ? <FaCheckCircle className="ok" /> : <FaExclamationTriangle className="warn" />}
                        <span>Estimated sell tax</span>
                        <strong>{String(results.sellTax)}%</strong>
                      </div>
                      <div className="bot__result-item">
                        {results.transferOk ? <FaCheckCircle className="ok" /> : <FaTimesCircle className="err" />}
                        <span>Transfer passes basic simulation</span>
                      </div>
                      <div className="bot__result-item">
                        {results.blacklistFunctions ? <FaExclamationTriangle className="warn" /> : <FaCheckCircle className="ok" />}
                        <span>Blacklist/whitelist functions present</span>
                      </div>
                      <div className="bot__result-item">
                        {results.ownerRenounced ? <FaCheckCircle className="ok" /> : <FaExclamationTriangle className="warn" />}
                        <span>Owner renounced</span>
                      </div>
                      {results.warnings?.length ? results.warnings.map((w, i) => (
                        <div key={i} className="bot__result-item"><FaExclamationTriangle className="warn" /><span>{w}</span></div>
                      )) : null}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showGate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Disponibilidade em breve"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              color: "#111",
              padding: 16,
              borderRadius: 8,
              width: "min(520px, 90vw)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              textAlign: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>Em breve disponível</h3>
            <p style={{ margin: "8px 0 16px" }}>Honeypot & Rug Pull Detector será liberado em:</p>
            <div style={{ fontFamily: "monospace", fontSize: 20 }} aria-live="polite">
              {timeLeft.days > 0 && (
                <span style={{ marginRight: 8 }}>{String(timeLeft.days)}d</span>
              )}
              <span>
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
            {!isBeforeRelease() && (
              <div style={{ marginTop: 12 }}>
                <button className="bot__btn" type="button" onClick={() => setShowGate(false)}>Entrar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
