import React from "react";
import "./FounderQuote.css";
import founderImg from "../assets/pedro.png";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function FounderQuote() {
  return (
    <section className="founder" id="fundador">
      <div className="container founder__container">
        <div className="founder__left">
          <div className="founder__quote-mark" aria-hidden="true">
            “
          </div>
          <h2 className="founder__title">
            Consultoria e treinamento para sua{" "}
            <span className="founder__title--accent">liberdade financeira</span>
          </h2>
          <p className="founder__subtitle">
            Ajudo pessoas e negócios a dominar DeFi com segurança e estratégia, conectando você à
            economia global. Atendo de pequenos negócios a grandes corporações — tokenização para
            agronegócio e indústrias, operações em stablecoins e soluções cripto integradas.
          </p>

          <div className="founder__signature">
            <strong>Pedro Magalhães</strong>
            <span>Fundador da Pedro dApps e Pixley Wallet</span>
          </div>

          <nav className="founder__social" aria-label="Redes sociais">
            <a
              className="founder__social-item"
              href="https://www.instagram.com/pedro_dapps"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram aria-hidden="true" />
            </a>
            <a
              className="founder__social-item"
              href="https://www.linkedin.com/in/pemagalhaes/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin aria-hidden="true" />
            </a>
            <a
              className="founder__social-item"
              href="https://www.youtube.com/@pedro_dapps"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube aria-hidden="true" />
            </a>
          </nav>
        </div>

        <div className="founder__right">
          <div className="founder__dataflow" aria-hidden="true"></div>
          <div className="founder__photo-wrap">
            <img src={founderImg} alt="Retrato de pessoa" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
