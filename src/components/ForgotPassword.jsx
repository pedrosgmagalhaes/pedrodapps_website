import React, { useState } from "react";
import "./ForgotPassword.css";
import pedrodappsIcon from "../assets/pedrodapps_icon.png";
import { API } from "../lib/api";
import TurnstileWidget from "./TurnstileWidget";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const TURNSTILE_ENABLED =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_TURNSTILE_ENABLED === "true";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const isValidEmail = (value) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage("Informe um e-mail válido.");
      return;
    }
    try {
      setStatus("loading");
      setMessage("");
      if (TURNSTILE_ENABLED && !turnstileToken) {
        setStatus("error");
        setMessage("Complete a verificação de segurança.");
        return;
      }
      const res = await API.auth.forgotPassword(email, TURNSTILE_ENABLED ? turnstileToken : null);
      if (res?.error) {
        const status = res?.status;
        const backendMsg = res?.data?.error || res?.data?.message;
        const friendly =
          backendMsg ||
          (status === 400
            ? "E-mail não encontrado."
            : status === 422
              ? "Dados inválidos. Verifique e tente novamente."
              : status === 500
                ? "Erro inesperado no servidor."
                : status === 0
                  ? "Falha de conexão com o servidor. Verifique sua internet."
                  : "Não foi possível solicitar a recuperação de senha.");
        throw new Error(friendly);
      }
      setStatus("success");
      setMessage("Pedido de recuperação enviado. Confira seu e-mail.");
    } catch {
      setStatus("error");
      setMessage("Ocorreu um erro ao enviar. Tente novamente.");
    }
  };

  return (
    <section className="forgot" id="recuperar-senha" aria-labelledby="forgot-title">
      <div className="container forgot__container">
        <div className="forgot__brand">
          <img src={pedrodappsIcon} alt="Pedro dApps" className="forgot__brand-logo" />
        </div>
        <div className="forgot__card" role="form" aria-describedby="forgot-desc">
          <header className="forgot__header">
            <h2 id="forgot-title" className="forgot__title">
              {t("forgot.title")}
            </h2>
            <p id="forgot-desc" className="forgot__subtitle">
              {t("forgot.subtitle")}
            </p>
          </header>

          {status !== "idle" && message && (
            <div
              className={`forgot__alert ${status === "error" ? "forgot__alert--error" : "forgot__alert--success"}`}
              role="status"
              aria-live="polite"
            >
              {message}
            </div>
          )}

          <form className="forgot__form" onSubmit={handleSubmit}>
            <div className="forgot__field">
              <label htmlFor="forgot-email" className="forgot__label">
                {t("login.email")}
              </label>
              <input
                id="forgot-email"
                name="email"
                type="email"
                className={`forgot__input ${status === "error" && !isValidEmail(email) ? "forgot__input--invalid" : ""}`}
                placeholder={t("login.emailPlaceholder")}
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="forgot__actions">
              <button
                type="submit"
                className="btn btn-primary forgot__btn"
                disabled={status === "loading"}
              >
                {status === "loading" ? t("forgot.button") + "..." : t("forgot.button")}
              </button>
              <a href="/login" className="forgot__link">
                {t("forgot.backToLogin")}
              </a>
            </div>
            {TURNSTILE_ENABLED && (
              <div style={{ marginTop: 8 }}>
                <TurnstileWidget onToken={(t) => setTurnstileToken(t)} />
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
