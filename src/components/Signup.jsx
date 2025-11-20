import React, { useState } from "react";
import "./Login.css"; // Reutilizando estilos de Login para consistência
import pedrodappsIcon from "../assets/pedrodapps_icon.png";
// import GoogleLogin from "./GoogleLogin"; // social login desativado por enquanto
import { registerWithPassword } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from 'react-i18next';
import TurnstileWidget from "./TurnstileWidget";

export default function Signup() {
  const { t } = useTranslation();
  const TURNSTILE_ENABLED = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TURNSTILE_ENABLED === 'true';
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (value) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
  const isValidPassword = (value) => value.length >= 6;
  const isValidName = (value) => value.length >= 2;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email) || !isValidPassword(password) || !isValidName(name)) {
      setStatus("error");
      setMessage("Por favor, preencha todos os campos corretamente.");
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
      const user = await registerWithPassword(email, password, name, TURNSTILE_ENABLED ? turnstileToken : null);
      setStatus("success");
      setMessage("Cadastro realizado com sucesso! Redirecionando para login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Ocorreu um erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <section className="login" id="signup" aria-labelledby="signup-title">
      <div className="container login__container">
        <div className="login__language-selector">
          <LanguageSelector />
        </div>
        <img src={pedrodappsIcon} alt="Pedro dApps" className="login__brand-logo" />

        <div className="login__card">
          <header className="login__header">
            <h2 id="signup-title" className="login__title">{t('signup.title')}</h2>
            <p id="signup-desc" className="login__subtitle">{t('signup.subtitle')}</p>
          </header>
          {status !== "idle" && message && (
            <div className={`login__alert ${status === "error" ? "login__alert--error" : "login__alert--success"}`} role="status" aria-live="polite">
              {message}
            </div>
          )}

          <form className="login__form" onSubmit={handleSubmit}>
            <div className="login__field">
              <label htmlFor="name" className="login__label">{t('signup.name')}</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`login__input ${status === "error" && !isValidName(name) ? "login__input--invalid" : ""}`}
                placeholder={t('signup.namePlaceholder')}
                required
                aria-invalid={status === "error" && !isValidName(name) ? "true" : "false"}
              />
            </div>
            <div className="login__field">
              <label htmlFor="email" className="login__label">{t('login.email')}</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`login__input ${status === "error" && !isValidEmail(email) ? "login__input--invalid" : ""}`}
                placeholder={t('login.emailPlaceholder')}
                required
                aria-invalid={status === "error" && !isValidEmail(email) ? "true" : "false"}
              />
            </div>
            <div className="login__field">
              <label htmlFor="password" className="login__label">{t('login.password')}</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`login__input ${status === "error" && !isValidPassword(password) ? "login__input--invalid" : ""}`}
                placeholder={t('signup.passwordPlaceholder')}
                required
                aria-invalid={status === "error" && !isValidPassword(password) ? "true" : "false"}
              />
            </div>
            <div className="login__actions">
              <button type="submit" className="btn btn-primary login__btn" disabled={status === "loading"}>
                {status === "loading" ? t('signup.button') + '...' : t('signup.button')}
              </button>
            </div>
            {TURNSTILE_ENABLED && (
              <div style={{ marginTop: 8 }}>
                <TurnstileWidget onToken={(t) => setTurnstileToken(t)} />
              </div>
            )}
          </form>

          {/** Social login desativado por enquanto */}
          {false && (
            <div className="login__oauth" aria-label="Cadastro com provedores">
              {/* <GoogleLogin onSuccess={(user) => navigate("/")} /> */}
            </div>
          )}

          <div className="login__footer">
            <p className="login__footer-text">
              Já tem conta? <a href="/login" className="login__link">Login</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}