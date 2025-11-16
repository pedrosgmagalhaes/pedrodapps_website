import React from "react";
import "./Footer.css";
import logoPedrodApps from "../assets/pedro_dapps_logo.png";
import { FaYoutube, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="container footer__container">
        <div className="footer__left">
          <a href="/" className="footer__logo" aria-label="Ir para a página principal">
            <img src={logoPedrodApps} alt="Pedro dApps" />
          </a>
          <p className="footer__copy">Pedro dApps © 2025</p>
        </div>

        <span className="footer__divider" aria-hidden="true" />

        <div className="footer__right">
          <div className="footer__social" aria-label="Redes sociais">
            <a
              className="social"
              href="https://www.youtube.com/@pedro_dapps"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="social__icon" size={18} aria-hidden="true" />
            </a>
            <a
              className="social"
              href="https://www.instagram.com/pedro_dapps/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="social__icon" size={18} aria-hidden="true" />
            </a>
            <a
              className="social"
              href="https://www.linkedin.com/in/pemagalhaes"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="social__icon" size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <div className="container footer__bottom">
        <p className="footer__bottom-text">
          Conteúdo educacional; não oferecemos aconselhamento financeiro. {""}
          Ao acessar nossa plataforma, você automaticamente aceita nossos {""}
          <a href="#servicos" aria-label="Abrir Termos de Serviço">
            Termos de Serviço
          </a>
          , nossa {""}
          <a href="#privacidade" aria-label="Abrir Política de Privacidade">
            Política de Privacidade
          </a>
          , bem como nossa {""}
          <a href="#cookies" aria-label="Abrir Política de Cookies">
            Política de Cookies
          </a>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;
