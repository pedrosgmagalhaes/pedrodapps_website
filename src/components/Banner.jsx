import React from 'react';
import './Banner.css';

export default function Banner() {
  return (
    <section className="banner" aria-labelledby="banner-title">
      <div className="container banner__container">
        <div className="banner__content">
          <h2 id="banner-title" className="banner__title">
            Grupo Exclusivo para Builders de Elite em Cripto.
            <br />
            Scripts, Tutoriais,
          </h2>
          <p className="banner__description">
            Acesso privilegiado a scripts prontos, operações DeFi e conteúdo avançado —
            comece hoje e avance com autonomia.
          </p>
        </div>
      </div>
    </section>
  );
}
