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
          <p className="footer__copy">
            Pedro dApps © 2025 — Tecnologia para a nova economia.
            <span className="footer__rights">Todos os direitos reservados.</span>
          </p>
        </div>

        <span className="footer__divider" aria-hidden="true" />

        <div className="footer__right">
          <div className="footer__social" aria-label="Redes sociais">
            <a className="social" href="#" aria-label="YouTube">
              <FaYoutube className="social__icon" size={18} aria-hidden="true" />
            </a>
            <a className="social" href="#" aria-label="Instagram">
              <FaInstagram className="social__icon" size={18} aria-hidden="true" />
            </a>
            <a className="social" href="#" aria-label="LinkedIn">
              <FaLinkedinIn className="social__icon" size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
