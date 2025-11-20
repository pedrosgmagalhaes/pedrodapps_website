import React from "react";
import "./Access30Days.css";
import checkPurple from "../assets/check_purple.svg";

const BENEFITS = [
  "Execução de Flash Loans em DeFi para arbitragem e liquidez",
  "Estruturas DeFi com stablecoins: yield, lending e colateral",
  "APIs completas para offshore.",
  "APIs de remessas internacionais com taxas competitivas e rastreio",
  "On/Off-ramp com moedas fiduciárias (USD, EUR, BRL)",
  "Tokenização de ativos e aplicações financeiras descentralizadas",
  "Arquitetura segura, autônoma e descentralizada para operações",
  "Auditoria e hardening de contratos inteligentes",
  "Liquidez, KYC/AML e rotas eficientes",
  "Dolarização e proteção patrimonial com estratégias de receita passiva",
  "Legalização de empresa cripto em paraísos fiscais.",
];

export default function Access30Days() {
  return (
    <section
      className="access30"
      id="acessos"
      aria-label="O que você vai acessar no GRUPO Elite Builders"
    >
      <div className="container">
        <div className="access30__grid">
          {/* Coluna esquerda: título, descrição e CTA */}
          <div className="access30__left">
            <h2 className="access30__title">
              O que você vai acessar
              <br />
              no GRUPO Elite Builders!
            </h2>
            <p className="access30__description">
              Acesso exclusivo a scripts prontos, operações DeFi avançadas e conteúdo especializado.
              Desde Flash Loans até proteção contra golpes na web3.
            </p>

            <div className="access30__actions">
              <a href="/checkout" className="access30__cta btn btn-primary">
                Quero fazer parte do Elite Builders
              </a>
            </div>
          </div>

          {/* Coluna direita: lista de benefícios */}
          <div className="access30__right">
            <ul className="access30__list">
              {BENEFITS.map((text, i) => (
                <li className="access30__item" key={i}>
                  <span className="access30__item-icon">
                    <img src={checkPurple} alt="" />
                  </span>
                  <span className="access30__item-text">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
