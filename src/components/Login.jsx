import React, { useState, useEffect, useCallback } from "react";
import "./Login.css";
import pedrodappsIcon from "../assets/pedrodapps_icon.png";
// import GoogleLogin from "./GoogleLogin"; // social login desativado por enquanto
import { loginWithPassword, registerWithPassword } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";
import TurnstileWidget from "./TurnstileWidget";
import { API } from "../lib/api";

export default function Login() {
  const { t } = useTranslation();
  const ENABLE_SOCIAL_LOGIN =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_ENABLE_SOCIAL_LOGIN === "true";
  const TURNSTILE_ENABLED =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_TURNSTILE_ENABLED === "true";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(null);
  const showExtras = email.trim().length > 0;
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [mobileAdvisoryOpen, setMobileAdvisoryOpen] = useState(false);
  const [mobileProceed, setMobileProceed] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const navigate = useNavigate();
  const sanitizeEmail = useCallback(
    (value) => String(value || "").replace(/\s+/g, "").toLowerCase(),
    []
  );

  const isValidEmail = useCallback((value) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value), []);

  const isValidPassword = (value) => {
    if (value.length < 8) return false;
    if (!/[A-Z]/.test(value)) return false;
    if (!/[a-z]/.test(value)) return false;
    if (!/[0-9]/.test(value)) return false;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return false;
    return true;
  };

  const isValidName = (value) => value.trim().length >= 2;

  const isMobileDevice = () => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || navigator.vendor || "";
    const isMobileUA = /(android|iphone|ipad|ipod|blackberry|iemobile|opera mini)/i.test(ua);
    const narrowViewport =
      typeof window !== "undefined" ? Math.min(window.innerWidth, window.innerHeight) < 640 : false;
    return isMobileUA || narrowViewport;
  };

  const checkEmailExists = useCallback(
    async (emailValue) => {
      if (!isValidEmail(emailValue)) return;
      if (TURNSTILE_ENABLED && !turnstileToken) return;
      setIsCheckingEmail(true);
      try {
        const res = await API.users.exists(emailValue, {
          turnstileToken: TURNSTILE_ENABLED ? turnstileToken : null,
        });
        if (res?.error) {
          setEmailExists(null);
        } else {
          setEmailExists(Boolean(res?.exists));
        }
      } catch {
        setEmailExists(null);
      } finally {
        setIsCheckingEmail(false);
      }
    },
    [isValidEmail, TURNSTILE_ENABLED, turnstileToken]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      if (email && isValidEmail(email)) {
        if (TURNSTILE_ENABLED && !turnstileToken) return;
        checkEmailExists(email);
      } else {
        setEmailExists(null);
      }
    }, 800);
    return () => clearTimeout(handler);
  }, [email, isValidEmail, checkEmailExists, TURNSTILE_ENABLED, turnstileToken]);

  const performAuth = async () => {
    setStatus("loading");
    setMessage("");
    try {
      if (TURNSTILE_ENABLED && !turnstileToken) {
        throw new Error("Complete a verificação de segurança.");
      }
      if (emailExists === false) {
        if (!isValidName(name)) throw new Error("Nome completo deve ter pelo menos 2 caracteres.");
        if (!isValidPassword(password))
          throw new Error("Senha deve ter: 8+ caracteres, maiúscula, minúscula, número e símbolo.");
        if (password !== confirmPassword) throw new Error("As senhas não coincidem.");
        const result = await registerWithPassword(
          email,
          password,
          name,
          TURNSTILE_ENABLED ? turnstileToken : null
        );
        void result;
        setMessage(
          "Cadastro enviado para avaliação. Em breve liberaremos seu acesso. Prepare seu e-mail para validação."
        );
      } else {
        if (password.length < 6) throw new Error("A senha deve ter pelo menos 6 caracteres.");
        await loginWithPassword(email, password, TURNSTILE_ENABLED ? turnstileToken : null);
        setMessage("Login realizado com sucesso! Redirecionando...");
      }
      setStatus("success");
      if (emailExists === true) {
        setTimeout(() => navigate("/members"), 1500);
      }
    } catch (error) {
      const msg = error?.message || "Erro ao processar. Tente novamente.";
      const isPending =
        /fase de análise|não foi aprovado/i.test(String(msg)) ||
        /Account not approved/i.test(String(msg));
      setStatus(isPending ? "notice" : "error");
      setMessage(msg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage("Informe um e-mail válido.");
      return;
    }
    if (isMobileDevice() && !mobileProceed) {
      setMobileAdvisoryOpen(true);
      return;
    }
    await performAuth();
  };

  // Carregar preferências salvas ao montar
  useEffect(() => {
    try {
      const rm = localStorage.getItem("remember_me") === "1";
      if (rm) {
        const savedEmail = sanitizeEmail(localStorage.getItem("remember_email") || "");
        const savedPassword = localStorage.getItem("remember_password") || "";
        setEmail(savedEmail);
        setPassword(savedPassword);
      }
      setRememberMe(rm);
    } catch {
      // Ignora falhas de acesso ao localStorage (ex.: privacy, sandbox)
      void 0;
    }
  }, [sanitizeEmail]);

  // Persistir alterações quando a opção estiver ativada
  useEffect(() => {
    try {
      if (rememberMe) {
        localStorage.setItem("remember_me", "1");
        localStorage.setItem("remember_email", sanitizeEmail(email));
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
  }, [rememberMe, email, password, sanitizeEmail]);

  const showPasswordFields = emailExists !== null;
  const isSignupMode = emailExists === false;
  const canLogin =
    !isSignupMode &&
    emailExists === true &&
    isValidEmail(email) &&
    password.trim().length >= 6 &&
    (!TURNSTILE_ENABLED || !!turnstileToken);

  const canSignup =
    isSignupMode &&
    isValidEmail(email) &&
    isValidName(name) &&
    isValidPassword(password) &&
    password === confirmPassword &&
    (!TURNSTILE_ENABLED || !!turnstileToken);

  const canSubmit = canLogin || canSignup;

  return (
    <section className="login" id="login" aria-labelledby="login-title">
      <div className="container login__container">
        <div className="login__brand">
          <img src={pedrodappsIcon} alt="Pedro dApps" className="login__brand-logo" />
        </div>
        <div className="login__card reveal-on-scroll" role="form" aria-describedby="login-desc">
          <div className="login__language-selector" aria-label="Selecionar idioma">
            <LanguageSelector />
          </div>
          <header className="login__header">
            <h2 id="login-title" className="login__title">
              {isSignupMode ? t("signup.title") : t("login.title")}
            </h2>
            <p id="login-desc" className="login__subtitle">
              {isSignupMode ? t("signup.subtitle") : t("login.subtitle")}
            </p>
          </header>
          {status !== "idle" && message && (
            <div
              className={`login__alert ${
                status === "error"
                  ? "login__alert--error"
                  : status === "success"
                    ? "login__alert--success"
                    : "login__alert--notice"
              }`}
              role="status"
              aria-live="polite"
            >
              {message}
            </div>
          )}

          <form className="login__form" onSubmit={handleSubmit}>
            <div className="login__field">
              <label htmlFor="email" className="login__label">
                {t("login.email")}
              </label>
              <div
                className={`login__input-wrapper login__input-wrapper--email ${status === "error" && !isValidEmail(email) ? "is-invalid" : ""}`}
              >
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
                  placeholder={t("login.emailPlaceholder")}
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(sanitizeEmail(e.target.value))}
                  onBlur={(e) => setEmail(sanitizeEmail(e.target.value))}
                />
              </div>
              {isCheckingEmail && (
                <span
                  className="login__checking"
                  role="status"
                  aria-live="polite"
                  aria-label="Carregando"
                >
                  <span className="login__checking-spinner" aria-hidden="true"></span>
                </span>
              )}
              {/* Mensagem de email não encontrado removida conforme solicitação */}
              {emailExists === true && (
                <div className="login__hint">Email encontrado. Digite sua senha.</div>
              )}
            </div>
            {TURNSTILE_ENABLED && (
              <div style={{ marginTop: 8 }}>
                <TurnstileWidget onToken={(t) => setTurnstileToken(t)} />
              </div>
            )}
            {showPasswordFields && (
              <>
                {isSignupMode && (
                  <div className="login__field">
                    <label htmlFor="name" className="login__label">
                      Nome Completo
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={`login__input ${status === "error" && !isValidName(name) ? "login__input--invalid" : ""}`}
                      placeholder="Seu Nome Completo"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}

                <div className="login__field">
                  <label htmlFor="password" className="login__label">
                    {t("login.password")}
                  </label>
                  <div
                    className={`login__input-wrapper ${status === "error" && password.length > 0 && (isSignupMode ? !isValidPassword(password) : password.length < 6) ? "is-invalid" : ""}`}
                  >
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`login__input ${status === "error" && password.length > 0 && (isSignupMode ? !isValidPassword(password) : password.length < 6) ? "login__input--invalid" : ""}`}
                      placeholder={
                        isSignupMode
                          ? "Mín. 8 caracteres, maiúscula, número e símbolo"
                          : t("login.passwordPlaceholder")
                      }
                      required={showExtras}
                      autoComplete={isSignupMode ? "new-password" : "current-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) =>
                        setCapsLockOn(e.getModifierState && e.getModifierState("CapsLock"))
                      }
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
                    <div className="login__hint" role="status" aria-live="polite">
                      Caps Lock ativado
                    </div>
                  )}
                  {isSignupMode && password && !isValidPassword(password) && (
                    <div className="login__hint">
                      Mín. 8 caracteres, maiúscula, minúscula, número e símbolo.
                    </div>
                  )}
                </div>

                {isSignupMode && (
                  <div className="login__field">
                    <label htmlFor="confirmPassword" className="login__label">
                      Confirmar Senha
                    </label>
                    <div
                      className={`login__input-wrapper ${status === "error" && confirmPassword && password !== confirmPassword ? "is-invalid" : ""}`}
                    >
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className={`login__input ${status === "error" && confirmPassword && password !== confirmPassword ? "login__input--invalid" : ""}`}
                        placeholder="Confirme sua senha"
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="login__reveal-btn"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={
                          showConfirmPassword ? "Ocultar confirmação" : "Mostrar confirmação"
                        }
                        aria-pressed={showConfirmPassword ? "true" : "false"}
                      >
                        {showConfirmPassword ? (
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
                    {confirmPassword && password !== confirmPassword && (
                      <div className="login__hint">As senhas não coincidem.</div>
                    )}
                  </div>
                )}

                {!isSignupMode && (
                  <div
                    className={`login__remember ${password.trim().length > 0 ? "is-visible" : ""}`}
                    aria-hidden={!(password.trim().length > 0)}
                  >
                    <label className="login__remember-label" htmlFor="remember">
                      <input
                        id="remember"
                        type="checkbox"
                        className="login__remember-input"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      {t("login.remember")}
                    </label>
                  </div>
                )}
                {/* Turnstile já renderizado acima para liberar verificação antecipada */}
              </>
            )}
            {/* bloco duplicado removido: "Lembrar senha" já é exibido acima quando não é signup */}

            <div className="login__actions">
              <button
                type="submit"
                className="btn btn-primary login__btn"
                disabled={status === "loading" || isCheckingEmail || !canSubmit}
              >
                {status === "loading"
                  ? isSignupMode
                    ? t("signup.button") + "..."
                    : t("login.button") + "..."
                  : isSignupMode
                    ? t("signup.button")
                    : t("login.button")}
              </button>
            </div>
            {isSignupMode && status === "success" && (
              <div className="login__post-signup" role="note" aria-live="polite">
                <p className="login__hint">
                  Seu cadastro foi recebido e aguarda aprovação por nossa equipe.
                </p>
                <button type="button" className="btn btn-secondary" disabled title="Em breve">
                  Validar e-mail
                </button>
              </div>
            )}
          </form>

          {/** Social login desativado por enquanto; controlado por env */}
          {ENABLE_SOCIAL_LOGIN && !isSignupMode && (
            <div className="login__oauth" aria-label="Login com provedores">
              {/* <GoogleLogin ... /> */}
            </div>
          )}
        </div>
        {!isSignupMode && (
          <div
            className={`login__forgot-out ${showExtras ? "is-visible" : ""}`}
            aria-hidden={!showExtras}
          >
            <a href="/recuperar-senha" className="login__forgot-link">
              Esqueceu a senha?
            </a>
          </div>
        )}
        <div className="login__disclaimer" role="note">
          {t("login.disclaimer")}
        </div>

        {mobileAdvisoryOpen && (
          <div
            className="login__modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-advisory-title"
          >
            <div className="login__modal">
              <header className="login__modal-header">
                <h3 id="mobile-advisory-title" className="login__modal-title">
                  Orientação de Acesso
                </h3>
              </header>
              <div className="login__modal-body">
                <p className="login__modal-text">{t("login.disclaimer")}</p>
                <div className="login__modal-terminal" aria-label="Terminal">
                  <pre className="login__modal-code">{`$ advise --device mobile
> recomendado: desktop
> continuar: possível, com limitações`}</pre>
                </div>
              </div>
              <footer className="login__modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setMobileAdvisoryOpen(false)}
                >
                  Voltar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={async () => {
                    setMobileProceed(true);
                    setMobileAdvisoryOpen(false);
                    await performAuth();
                  }}
                >
                  Prosseguir no mobile
                </button>
              </footer>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
