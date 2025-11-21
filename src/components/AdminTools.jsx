import React, { useState } from "react";
import { API, getBaseURL } from "../lib/api";

export default function AdminTools() {
  const [email, setEmail] = useState("pedrosgmagalhaes@gmail.com");
  const [name, setName] = useState("Pedro Magalhaes");
  const [note, setNote] = useState("Manual test: Builders de Elite granted");
  const [adminToken, setAdminToken] = useState("change_me_admin");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await API.admin.testCreateBuilder({ email, name, note }, adminToken);
      setResult(res);
    } catch (err) {
      setError(String(err?.message || err || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container" style={{ padding: "2rem 1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Admin Tools — Test Create Builder</h2>
      <p style={{ marginBottom: "1rem" }}>
        Base URL: <code>{getBaseURL()}</code>
      </p>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem", maxWidth: 520 }}>
        <label>
          <div>E-mail</div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          <div>Nome</div>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          <div>Nota</div>
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <label>
          <div>Admin Token</div>
          <input
            type="text"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            required
          />
        </label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
          </button>
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setError(null);
            }}
          >
            Limpar resultado
          </button>
        </div>
      </form>

      {error && <div style={{ marginTop: "1rem", color: "#b00020" }}>Erro: {error}</div>}

      {result && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Resposta</h3>
          <pre
            style={{
              background: "#0f0f13",
              color: "#e0e0e0",
              padding: "1rem",
              borderRadius: "8px",
              overflowX: "auto",
            }}
          >
            {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}
