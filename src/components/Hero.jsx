import React, { useState, useEffect } from "react";
import "./Hero.css";
import pedroImg from "../assets/pedro.png";
import { FaYoutube } from "react-icons/fa";
import { X as IconClose } from "lucide-react";

const Hero = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openVideo = () => setIsVideoOpen(true);
  const closeVideo = () => setIsVideoOpen(false);

  // Fecha com tecla ESC e bloqueia o scroll do body enquanto o modal está aberto
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsVideoOpen(false);
      }
    };
    if (isVideoOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isVideoOpen]);

  return (
    <section className="hero" aria-label="Apresentação">
      <div className="container">
        <div className="hero__layout">
          <div className="hero__content">
            <h1 className="hero__title">
              CURSOS, TREINAMENTO,
              <br />
              SCRIPTS
            </h1>
            <p className="hero__desc">
              Aprenda de vez como operar em uma rede descentralizada através de
              criptomoedas, stablecoins e DeFi
            </p>

            <div className="hero__actions">
              <button
                type="button"
                className="hero__btn hero__btn--primary hero__btn--attention"
                onClick={openVideo}
                aria-label="Assistir ao vídeo no YouTube"
              >
                <FaYoutube className="hero__btn-icon" aria-hidden="true" />
                <span className="hero__btn-label">Assistir o vídeo</span>
              </button>
            </div>
          </div>

          {/* Destaque à direita: Pedro */}
          <figure className="hero__figure">
            <img src={pedroImg} alt="Pedro em destaque" className="hero__image" />
          </figure>
        </div>
      </div>

      {isVideoOpen && (
        <div
          className="video-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Vídeo de apresentação"
          onClick={(e) => {
            // Fecha ao clicar fora do conteúdo do modal
            if (e.target === e.currentTarget) closeVideo();
          }}
        >
          <button
            type="button"
            className="video-modal__close"
            onClick={closeVideo}
            aria-label="Fechar vídeo"
            title="Fechar"
          >
            <IconClose size={24} aria-hidden="true" />
          </button>
          <div className="video-modal__content">
            <div className="video-modal__frame">
              <iframe
                className="video-modal__iframe"
                src="https://www.youtube.com/embed/Da1RyYf4wFA?autoplay=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
