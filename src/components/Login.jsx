import React, { useState } from "react";
import "./Login.css";
import pedrodappsIcon from "../assets/pedrodapps_icon.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const isValidEmail = (value) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);

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

    try {
      setStatus("loading");
      setMessage("");
      await new Promise((resolve) => setTimeout(resolve, 900));
      setStatus("success");
      setMessage("Login efetuado com sucesso.");
    } catch {
      setStatus("error");
      setMessage("Ocorreu um erro ao entrar. Tente novamente.");
    }
  };

  return (
    <section className="login" id="login" aria-labelledby="login-title">
      <div className="container login__container">
        <div className="login__brand">
          <img src={pedrodappsIcon} alt="Pedro dApps" className="login__brand-logo" />
        </div>
        <div className="login__card" role="form" aria-describedby="login-desc">
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

            <div className="login__field">
              <label htmlFor="password" className="login__label">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                className={`login__input ${status === "error" && password.length > 0 && password.length < 6 ? "login__input--invalid" : ""}`}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="login__actions">
              <button type="submit" className="btn btn-primary login__btn" disabled={status === "loading"}>
                {status === "loading" ? "Entrando..." : "Entrar"}
              </button>
              <a href="#recuperar-senha" className="login__link">Esqueci minha senha</a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}