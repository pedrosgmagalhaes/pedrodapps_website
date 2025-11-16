import React from "react";
import "./Banner.css";

export default function Banner() {
  return (
    <section className="banner" aria-labelledby="banner-title">
      <div className="container banner__container">
        <div className="banner__content">
          <h2 id="banner-title" className="banner__title">
            Grupo Exclusivo para Builders de Elite em Cripto.
          </h2>
          <p className="banner__description">
            Abordagens e operações financeiras avançadas envolvendo DeFi, APIs de offshore e
            remessas internacionais.
          </p>
        </div>
      </div>
    </section>
  );
}
