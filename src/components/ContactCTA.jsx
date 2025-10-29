import React from "react";
import "./ContactCTA.css";
import coins2Img from "../assets/icons2.png";

export default function ContactCTA() {
  return (
    <section className="contact" id="duvidas">
      <div className="container contact__container">
        <div className="contact__content">
          <span className="contact__eyebrow">DÚVIDAS</span>
          <h2 className="contact__title">Ainda tem dúvidas? Fale com nossos especialistas</h2>
          <p className="contact__subtitle">
            Nossa equipe de especialistas está pronta para orientar você e o seu negócio. Entre em contato e
            vamos ajudar com o que você precisa.
          </p>

          <div className="contact__actions">
            <a href="#contato" className="hero__btn hero__btn--primary">Quero tirar dúvidas</a>
          </div>
        </div>

        <div className="contact__coins-wrap" aria-hidden="true">
          <img className="contact__coins" src={coins2Img} alt="" />
        </div>
      </div>
    </section>
  );
}
