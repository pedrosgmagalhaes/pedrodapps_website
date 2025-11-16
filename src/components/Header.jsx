import React, { useState, useEffect } from "react";
import "./Header.css";
import logoPedrodApps from "../assets/pedro_dapps_logo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? "header--scrolled" : ""}`}>
      <div className="container">
        <div className="header__content">
          {/* Logo */}
          <div className="header__logo">
            <a href="/" className="logo" aria-label="Ir para a página principal">
              <img src={logoPedrodApps} alt="Pedro dApps" className="logo__image" />
            </a>
          </div>

          {/* Navegação removida conforme solicitação */}

          {/* Ações / CTAs no canto direito */}
          <div className="header__actions">
            <a
              href="#checkout"
              className="header__btn header__btn--primary"
              aria-label="Faça parte"
            >
              <span className="header__btn-label">Faça parte!</span>
            </a>

            <a
              href="#login"
              className="header__btn header__btn--outline"
              aria-label="Entrar"
            >
              <span className="header__btn-label">Entrar</span>
            </a>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
