import React from "react";
import "./Access30Days.css";
import checkPurple from "../assets/check_purple.svg";

const BENEFITS = [
  "Como funciona o mercado de exchanges e corretoras",
  "Como montar uma estrutura segura, autônoma e descentralizada",
  "Como enviar e receber valores globalmente com criptomoedas",
  "Estratégias de proteção patrimonial e receita passiva",
  "Como dolarizar patrimônio com cripto",
  "Legalização e operação de uma empresa de cripto",
  "Comece a operar com a sua própria exchange personalizada durante os 30 dias de acesso à infraestrutura White Label.",
];

export default function Access30Days() {
  return (
    <section className="access30" id="acessos" aria-label="O que você vai acessar nos primeiros 30 dias">
      <div className="container">
        <div className="access30__grid">
          {/* Coluna esquerda: título, descrição e CTA */}
          <div className="access30__left">
            <h2 className="access30__title">
              O que você vai acessar
              <br />
              nos primeiros 30 dias!
            </h2>
            <p className="access30__description">
              Você terá acesso imediato a todos os cursos do Pedro dApps disponíveis.
              Desde operação de exchanges, até remessas internacionais com stablecoins.
            </p>

            <div className="access30__actions">
              <a href="#cursos" className="access30__cta btn btn-primary">
                Quero montar minha corretora
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
