import React from "react";
import "./Hero.css";
import pedroImg from "../assets/pedro.png";

const Hero = () => {
  return (
    <section className="hero" aria-label="Apresentação">
      <div className="container">
        <div className="hero__layout">
          <div className="hero__content">
            <h1 className="hero__title">
              CURSOS, CAPACITAÇÃO E
              <br />
              TREINAMENTO EM CRIPTO
            </h1>
            <p className="hero__desc">
              Aprenda de vez como operar em uma rede descentralizada através de
              criptomoedas, stablecoins e DeFi
            </p>

            <div className="hero__actions">
              <a href="#cursos" className="hero__btn hero__btn--primary">
                Cursos disponíveis
              </a>
            </div>
          </div>

          {/* Destaque à direita: Pedro */}
          <figure className="hero__figure">
            <img src={pedroImg} alt="Pedro em destaque" className="hero__image" />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default Hero;
