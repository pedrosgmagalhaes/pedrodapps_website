import React, { useState, useEffect } from "react";
import "./Login.css";
import pedrodappsIcon from "../assets/pedrodapps_icon.png";
import GoogleLogin from "./GoogleLogin";
import { loginWithPassword } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const showExtras = email.trim().length > 0;
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [mobileAdvisoryOpen, setMobileAdvisoryOpen] = useState(false);
  const [mobileProceed, setMobileProceed] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (value) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);

  const isMobileDevice = () => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || navigator.vendor || "";
    const isMobileUA = /(android|iphone|ipad|ipod|blackberry|iemobile|opera mini)/i.test(ua);
    const narrowViewport = typeof window !== "undefined" ? Math.min(window.innerWidth, window.innerHeight) < 640 : false;
    return isMobileUA || narrowViewport;
  };

  const performLogin = async () => {
    try {
      setStatus("loading");
      setMessage("");
      await loginWithPassword(email, password);
      setStatus("success");
      setMessage("Login efetuado com sucesso.");
      navigate("/members/home", { replace: true });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage(err?.message || "Ocorreu um erro ao entrar. Tente novamente.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validações básicas
    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage("Informe um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      setStatus("error");
      setMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    // Se for mobile e o usuário ainda não confirmou que quer prosseguir, exibe modal corporativo
    if (isMobileDevice() && !mobileProceed) {
      setMobileAdvisoryOpen(true);
      return;
    }
    await performLogin();
  };

  // Carregar preferências salvas ao montar
  useEffect(() => {
    try {
      const rm = localStorage.getItem("remember_me") === "1";
      if (rm) {
        const savedEmail = localStorage.getItem("remember_email") || "";
        const savedPassword = localStorage.getItem("remember_password") || "";
        setEmail(savedEmail);
        setPassword(savedPassword);
      }
      setRememberMe(rm);
    } catch {
      // Ignora falhas de acesso ao localStorage (ex.: privacy, sandbox)
      void 0;
    }
  }, []);

  // Persistir alterações quando a opção estiver ativada
  useEffect(() => {
    try {
      if (rememberMe) {
        localStorage.setItem("remember_me", "1");
        localStorage.setItem("remember_email", email);
        localStorage.setItem("remember_password", password);
      } else {
        localStorage.setItem("remember_me", "0");
        localStorage.removeItem("remember_email");
        localStorage.removeItem("remember_password");
      }
    } catch {
      // Ignora falhas de acesso ao localStorage (ex.: privacy, sandbox)
      void 0;
    }
  }, [rememberMe, email, password]);

  return (
    <section className="login" id="login" aria-labelledby="login-title">
      <div className="container login__container">
        <div className="login__brand">
          <img src={pedrodappsIcon} alt="Pedro dApps" className="login__brand-logo" />
        </div>
        <div className="login__card reveal-on-scroll" role="form" aria-describedby="login-desc">
          <header className="login__header">
            <h2 id="login-title" className="login__title">
              Entrar
            </h2>
            <p id="login-desc" className="login__subtitle">
              Acesse sua conta para operar com o Pedro dApps.
            </p>
          </header>
          {status !== "idle" && message && (
            <div className={`login__alert ${status === "error" ? "login__alert--error" : "login__alert--success"}`} role="status" aria-live="polite">
              {message}
            </div>
          )}

          <form className="login__form" onSubmit={handleSubmit}>
            <div className="login__field">
              <label htmlFor="email" className="login__label">E-mail</label>
              <div className={`login__input-wrapper login__input-wrapper--email ${status === "error" && !isValidEmail(email) ? "is-invalid" : ""}`}>
                <span className="login__input-icon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    focusable="false"
                    aria-hidden="true"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                    <path d="M22 6L12 13 2 6" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`login__input ${status === "error" && !isValidEmail(email) ? "login__input--invalid" : ""}`}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className={`login__password ${showExtras ? "is-visible" : ""}`} aria-hidden={!showExtras}>
            <div className="login__field">
              <label htmlFor="password" className="login__label">Senha</label>
              <div className={`login__input-wrapper ${status === "error" && password.length > 0 && password.length < 6 ? "is-invalid" : ""}`}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`login__input ${status === "error" && password.length > 0 && password.length < 6 ? "login__input--invalid" : ""}`}
                  placeholder="••••••••"
                  required={showExtras}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => setCapsLockOn(e.getModifierState && e.getModifierState("CapsLock"))}
                  onBlur={() => setCapsLockOn(false)}
                  aria-describedby="password-reveal"
                />
                <button
                  id="password-reveal"
                  type="button"
                  className="login__reveal-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword ? "true" : "false"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.046 10.046 0 012.04-3.287" />
                      <path d="M6.18 6.18A10.05 10.05 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.06 10.06 0 01-4.807 5.642" />
                      <path d="M9.88 9.88a3 3 0 104.24 4.24" />
                      <path d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {capsLockOn && (
                <div className="login__hint" role="status" aria-live="polite">Caps Lock ativado</div>
              )}
            </div>
            </div>
            <div className={`login__remember ${password.trim().length > 0 ? "is-visible" : ""}`} aria-hidden={!(password.trim().length > 0)}>
              <label className="login__remember-label" htmlFor="remember">
                <input
                  id="remember"
                  type="checkbox"
                  className="login__remember-input"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Lembrar senha
              </label>
            </div>

            <div className="login__actions">
              <button type="submit" className="btn btn-primary login__btn" disabled={status === "loading"}>
                {status === "loading" ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </form>

          <div className="login__oauth" aria-label="Login com provedores">
            <GoogleLogin
              onSuccess={() => {
                setStatus("success");
                setMessage("Login efetuado com Google.");
      navigate("/members/home", { replace: true });
              }}
              onError={(err) => {
                setStatus("error");
                // Mensagem amigável já mapeada em auth.js; usa fallback genérico
                setMessage(err?.message || "Não foi possível entrar com Google. Tente novamente.");
                console.error(err);
              }}
            />
          </div>
        </div>
        <div className={`login__forgot-out ${showExtras ? "is-visible" : ""}`} aria-hidden={!showExtras}>
          <a href="/recuperar-senha" className="login__forgot-link">Esqueceu a senha?</a>
        </div>
        <div className="login__disclaimer" role="note">
          Para garantir a <strong>melhor experiência</strong> e a <strong>conformidade operacional</strong>, recomenda-se o acesso por
          <strong>computador (desktop)</strong>. Determinadas <strong>etapas</strong> e <strong>execuções</strong> dependem de um <strong>ambiente de trabalho de desktop</strong>.
        </div>

        {mobileAdvisoryOpen && (
          <div className="login__modal-overlay" role="dialog" aria-modal="true" aria-labelledby="mobile-advisory-title">
            <div className="login__modal">
              <header className="login__modal-header">
                <h3 id="mobile-advisory-title" className="login__modal-title">Orientação de Acesso</h3>
              </header>
              <div className="login__modal-body">
                <p className="login__modal-text">
                  Para garantir a <strong>melhor experiência</strong> e a <strong>conformidade operacional</strong>, recomenda-se o acesso por
                  <strong> computador (desktop)</strong>. Determinadas <strong>etapas</strong> e <strong>execuções</strong> dependem de um <strong>ambiente de trabalho de desktop</strong>.
                </p>
                <div className="login__modal-terminal" aria-label="Terminal">
                  <pre className="login__modal-code">{`$ advise --device mobile
> recomendado: desktop
> continuar: possível, com limitações`}</pre>
                </div>
              </div>
              <footer className="login__modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setMobileAdvisoryOpen(false)}>Voltar</button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={async () => {
                    setMobileProceed(true);
                    setMobileAdvisoryOpen(false);
                    await performLogin();
                  }}
                >Prosseguir no mobile</button>
              </footer>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}