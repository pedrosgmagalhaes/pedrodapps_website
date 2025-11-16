import React, { useState } from "react";
import "./ForgotPassword.css";
import pedrodappsIcon from "../assets/pedrodapps_icon.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

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
      await new Promise((resolve) => setTimeout(resolve, 900));
      setStatus("success");
      setMessage("Se existir uma conta com este e-mail, enviaremos instruções de recuperação.");
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
            <h2 id="forgot-title" className="forgot__title">Recuperar senha</h2>
            <p id="forgot-desc" className="forgot__subtitle">Informe seu e-mail para receber instruções de recuperação.</p>
          </header>

          {status !== "idle" && message && (
            <div className={`forgot__alert ${status === "error" ? "forgot__alert--error" : "forgot__alert--success"}`} role="status" aria-live="polite">
              {message}
            </div>
          )}

          <form className="forgot__form" onSubmit={handleSubmit}>
            <div className="forgot__field">
              <label htmlFor="forgot-email" className="forgot__label">E-mail</label>
              <input
                id="forgot-email"
                name="email"
                type="email"
                className={`forgot__input ${status === "error" && !isValidEmail(email) ? "forgot__input--invalid" : ""}`}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="forgot__actions">
              <button type="submit" className="btn btn-primary forgot__btn" disabled={status === "loading"}>
                {status === "loading" ? "Enviando..." : "Enviar instruções"}
              </button>
              <a href="#login" className="forgot__link">Voltar ao login</a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}