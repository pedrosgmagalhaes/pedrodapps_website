import React from "react";
import "./Hero.css";
import MatrixRain from "./MatrixRain.jsx";
import heroPoster from "../assets/buildersdeelite.png";
import heroVideo from "../assets/builders_de_elite_animation.mp4";

const Hero = () => {
  // Layout simplificado: imagem principal e CTA único

  return (
    <section className="hero" aria-label="Apresentação">
      <video
        className="hero__bg-video"
        src={heroVideo}
        poster={heroPoster}
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <MatrixRain />
    </section>
  );
};

export default Hero;
