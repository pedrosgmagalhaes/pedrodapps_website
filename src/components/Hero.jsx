import React, { useState, useCallback } from "react";
import "./Hero.css";
import MatrixRain from "./MatrixRain.jsx";
import heroPoster from "../assets/buildersdeelite.png";
import heroVideo from "../assets/grok-video-7eea608f-43e1-4b0f-a6d7-41dc41eb51a1.mp4";

const Hero = () => {
  // Layout simplificado: imagem principal e CTA único

  const [videoReady, setVideoReady] = useState(false);
  const markReady = useCallback(() => setVideoReady(true), []);

  return (
    <section className={videoReady ? "hero hero--ready" : "hero hero--loading"} aria-label="Apresentação">
      <div className="hero__video-frame">
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
          onLoadedData={markReady}
          onCanPlay={markReady}
          onCanPlayThrough={markReady}
        />
      </div>
      <MatrixRain />
    </section>
  );
};

export default Hero;
