import React from "react";
import "./Access30Days.css";
import checkPurple from "../assets/check_purple.svg";

const BENEFITS = [
  "Scripts de Flash Loan para operações avançadas",
  "Operação Estruturada em DeFi envolvendo stablecoin",
  "Plataformas de tokenização e suas aplicações",
  "Hacks de cripto para estudos e análise de segurança",
  "Ferramentas para operar no mercado de forma segura",
  "Como funciona o mercado de exchanges e corretoras",
  "Como montar uma estrutura segura, autônoma e descentralizada",
  "Como enviar e receber valores globalmente com criptomoedas",
  "Estratégias de proteção patrimonial e receita passiva",
  "Como dolarizar patrimônio com cripto",
  "Legalização e operação de uma empresa de cripto no exterior",
];

export default function Access30Days() {
  return (
    <section className="access30" id="acessos" aria-label="O que você vai acessar no GRUPO BUILDERS de ELITE">
      <div className="container">
        <div className="access30__grid">
          {/* Coluna esquerda: título, descrição e CTA */}
          <div className="access30__left">
            <h2 className="access30__title">
              O que você vai acessar
              <br />
              no GRUPO BUILDERS de ELITE!
            </h2>
            <p className="access30__description">
              Acesso exclusivo a scripts prontos, operações DeFi avançadas e conteúdo especializado.
              Desde Flash Loans até proteção contra golpes na web3.
            </p>

            <div className="access30__actions">
              <a href="#cursos" className="access30__cta btn btn-primary">
                Quero fazer parte do Builders de Elite
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
