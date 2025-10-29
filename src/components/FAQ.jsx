import React from "react";
import "./FAQ.css";
import whiteLabelImg from "../assets/whitelabel.png";

const faqs = [
  {
    q: "Preciso ter experiência com criptomoedas?",
    a: "Não. O curso é pensado para iniciantes ou pessoas com pouca experiência.",
  },
  {
    q: "Esse curso ensina a investir ou especular?",
    a: "Não. O foco é criar um negócio prático e rentável, não especular no mercado.",
  },
  {
    q: "Terei suporte durante o curso?",
    a: "Sim! O suporte é feito via comunidade e canais diretos com o time da Pixley.",
  },
  {
    q: "Posso começar mesmo com pouco dinheiro?",
    a: "Sim. A infraestrutura é acessível e escalável desde o início.",
  },
];

export default function FAQ() {
  return (
    <section className="faq" id="faq">
      <div className="container faq__container">
        <div className="faq__left">
          <header className="faq__header">
            <span className="faq__badge" aria-hidden="true">FAQ</span>
            <h2 className="faq__title">
              Perguntas <span className="faq__title--accent">Frequentes</span>
            </h2>
          </header>

          <ul className="faq__list">
            {faqs.map((item, idx) => (
              <li className="faq__item" key={idx}>
                <span className="faq__bullet" aria-hidden="true">{idx + 1}</span>
                <div className="faq__content">
                  <h3 className="faq__question">{item.q}</h3>
                  <p className="faq__answer">{item.a}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="faq__right">
          <div className="faq__device">
            <img src={whiteLabelImg} alt="Prévia whitelabel do app" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
