import React from "react";
import "./Hero.css";
import MatrixRain from "./MatrixRain.jsx";

const Hero = () => {
  // Layout simplificado: imagem principal e CTA único

  return (
    <section className="hero" aria-label="Apresentação">
      <MatrixRain />
      <div className="container">
        <div className="hero__layout">
          <div className="hero__content"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
