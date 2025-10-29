import React from 'react';
import './Banner.css';

export default function Banner() {
  return (
    <section className="banner" aria-labelledby="banner-title">
      <div className="container banner__container">
        <div className="banner__content">
          <h2 id="banner-title" className="banner__title">
            Comece agora sua jornada
            <br />
            no mercado cripto!
          </h2>
          <p className="banner__description">
            Ative sua plataforma e comece a operar em até 24h.
          </p>
          <a className="banner__cta" href="#" aria-label="Quero começar agora">
            <span>Quero começar agora</span>
            <svg className="banner__cta-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M5 12h12M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
