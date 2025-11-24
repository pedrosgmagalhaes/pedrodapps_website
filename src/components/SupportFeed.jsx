import React, { useState } from "react";
import { FaWhatsapp, FaListUl, FaInfoCircle } from "react-icons/fa";

export default function SupportFeed() {
  const groupUrl = "https://chat.whatsapp.com/CaLsaJFf7Yq41yXoIGLY6p";
  const [accepted, setAccepted] = useState(false);
  const handleOpenGroup = () => {
    if (!accepted) return;
    window.open(groupUrl, "_blank", "noopener,noreferrer");
  };
  return (
    <section className="support" aria-labelledby="support-title">
      <header className="support__header">
        <h2 id="support-title" className="support__title">Grupo do WhatsApp</h2>
        <div className="support__meta">Participe para tirar dúvidas e trocar ideias</div>
      </header>
      <div className="home__bot-video" role="region" aria-label="Convite para grupo">
        <div className="home__bot-video-caption">

          
          <div className="botinfo__grid" style={{ marginTop: 12 }}>
            <div className="botinfo__card">
              <div className="botinfo__card-title">
                <FaListUl aria-hidden="true" /> Regras básicas
              </div>
              <ul className="botinfo__list" role="list">
                <li className="botinfo__list-item">Respeitar e não ofender ninguém</li>
                <li className="botinfo__list-item">Respeitar horários comerciais para perguntas e respostas</li>
                <li className="botinfo__list-item">Evitar spam ou divulgação não relacionada</li>
                <li className="botinfo__list-item">Não compartilhar dados sensíveis</li>
              </ul>
            </div>

            <div className="botinfo__card">
              <div className="botinfo__card-title">
                <FaInfoCircle aria-hidden="true" /> Orientações
              </div>
              <ul className="botinfo__list" role="list">
                <li className="botinfo__list-item">Seja claro e objetivo ao pedir ajuda</li>
                <li className="botinfo__list-item">Use o grupo para suporte e troca de ideias</li>
              </ul>
            </div>
          </div>
          <label className="botinfo__terms" aria-label="Aceite do termo de participação" style={{ marginTop: 14 }}>
            <span className="botinfo__terms-inputwrap">
              <input
                id="whatsapp-accept"
                type="checkbox"
                className="botinfo__terms-checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                aria-checked={accepted}
              />
            </span>
            <span className="botinfo__terms-label">
              Declaro que li, compreendi e <span className="botinfo__terms-accept">ACEITO</span> integralmente as regras do grupo acima. Concordo em manter respeito, evitar spam e não compartilhar dados sensíveis.
            </span>
          </label>
          <p style={{ marginTop: 12 }}>Entre no nosso grupo oficial para suporte e comunidade:</p>
          <div className="botinfo__actions">
            <button
              type="button"
              className={`botinfo__btn-download botinfo__btn-download--xl ${accepted ? "" : "is-disabled"}`}
              onClick={accepted ? handleOpenGroup : undefined}
              disabled={!accepted}
              aria-disabled={!accepted}
              aria-describedby="whatsapp-accept"
              title={accepted ? "Entrar no grupo" : "Marque o aceite para liberar o acesso"}
            >
              <FaWhatsapp aria-hidden="true" /> Entrar no Grupo do WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
