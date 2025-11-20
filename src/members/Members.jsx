import React, { useEffect, useState } from "react";
import "./Members.css";
import { requireAuth, getUser, logout } from "../lib/auth";

export default function Members() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // protege a página: redireciona para #login se não houver sessão
    if (!requireAuth()) return;
    setUser(getUser());
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.replace("/login");
  };

  return (
    <section className="members" id="members" aria-labelledby="members-title">
      <div className="container members__container">
        <header className="members__header">
          <h2 id="members-title" className="members__title">Área de Membros</h2>
          <p className="members__subtitle">
            Bem-vindo{user?.email ? `, ${user.email}` : ""}. Aqui você acessa conteúdos e recursos exclusivos.
          </p>
        </header>

        <div className="members__content" role="region" aria-label="Conteúdo restrito">
          <div className="members__card">
            <h3 className="members__card-title">Conteúdos exclusivos</h3>
            <p className="members__card-text">
              Em breve: scripts, materiais, lives e integrações. Esta é uma área autenticada.
            </p>
          </div>
          <div className="members__actions">
            <button className="members__logout" onClick={handleLogout}>Sair</button>
          </div>
        </div>
      </div>
    </section>
  );
}