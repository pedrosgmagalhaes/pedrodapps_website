import React from "react";
import "./ContactCTA.css";
import coins2Img from "../assets/icons2.png";

export default function ContactCTA() {
  return (
    <section className="contact" id="duvidas">
      <div className="container contact__container">
        <div className="contact__content">
          <span className="contact__eyebrow">BUILDERS DE ELITE</span>
          <h2 className="contact__title">Pronto para começar? Faça parte do Builders de Elite</h2>
          <p className="contact__subtitle">
            Garanta seu acesso e junte-se ao Builders de Elite para começar agora.
          </p>

          <div className="contact__actions">
            <a href="#checkout" className="hero__btn hero__btn--primary">
              Quero fazer parte
            </a>
          </div>
        </div>

        <div className="contact__coins-wrap" aria-hidden="true">
          <img className="contact__coins" src={coins2Img} alt="" />
        </div>
      </div>
    </section>
  );
}
