import React from "react";
import "./VipArea.css";
import checkNavy from "../assets/check_navy.svg";
import cardsImg from "../assets/cards.svg";

const benefits = [
  "Acesso completo ao curso",
  "Oferta válida por 30 dias",
  "Plano recorrente ativo após 6 meses (sem adesão contratual)",
  "Sem taxas ocultas — tudo transparente e acessível",
];

export default function VipArea() {
  return (
    <section className="vip" id="vip" aria-label="Área VIP e oferta">
      <div className="container">
        <div className="vip__grid">
          {/* Coluna esquerda: benefícios */}
          <div className="vip__left">
            <h2 className="vip__title">Tenha acesso à<br />
              <span className="vip__title-highlight">Área VIP</span>
            </h2>
            <p className="vip__subtitle">Oferta exclusiva — por tempo limitado</p>
            <ul className="vip__list">
              {benefits.map((b, i) => (
                <li className="vip__item" key={i}>
                  <span className="vip__item-icon" aria-hidden="true">
                    <img src={checkNavy} alt="" />
                  </span>
                  <span className="vip__item-text">{b}</span>
                </li>
              ))}
            </ul>

            <p className="vip__guarantee">
              30 dias de garantia de satisfação
              <span className="vip__guarantee-detail">
                Se decidir não continuar, cancele dentro do período — sem complicações, sem cobranças extras.
              </span>
            </p>
          </div>

          {/* Coluna direita: cartão de preço */}
          <div className="vip__right">
            <div className="vip-card" role="region" aria-label="Cartão de preço">
              <div className="vip-card__header">
                <span className="vip-card__old-price">De R$ 12.874,60</span>
              </div>
              <div className="vip-card__price">
                <span className="vip-card__currency">R$</span>
                <span className="vip-card__amount">5.637,80</span>
                <span className="vip-card__period">por mês</span>
              </div>
              <a href="#comprar" className="vip-card__cta" aria-label="Quero comprar agora">
                Quero comprar agora
              </a>
              <div className="vip-card__footnote">
                Pagamento seguro • Cartão • Pix
              </div>
              <img src={cardsImg} alt="Bandeiras de cartões" className="vip-card__cards" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
