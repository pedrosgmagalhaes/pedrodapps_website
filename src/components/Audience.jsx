import React from "react";
import "./Audience.css";
import checkNavy from "../assets/check_navy.svg";

const ITEMS = [
  "Empreendedores iniciantes no mercado cripto",
  "Operadores que querem transformar conhecimento em negócio",
  "Criadores de conteúdo que desejam lançar suas próprias plataformas",
  "Desenvolvedores que querem liberdade econômica e trabalhar por conta própria",
  "Startups que querem explorar novos modelos de negócio online para web3",
  "Quem busca liberdade financeira com tecnologias descentralizadas",
];

export default function Audience() {
  return (
    <section className="audience" id="para-quem" aria-label="Esse curso é para quem">
      <div className="container">
        <header className="audience__header">
          <h2 className="audience__title">Esse curso é para quem...</h2>
          <p className="audience__subtitle">
            Quer transformar interesse em criptomoedas em um negócio de verdade, mesmo começando do zero.
          </p>
        </header>

        <div className="audience__grid">
          {ITEMS.map((text, i) => (
            <div className="audience__pill" key={i}>
              <span className="audience__pill-icon" aria-hidden="true">
                <img src={checkNavy} alt="" />
              </span>
              <span className="audience__pill-text">{text}</span>
            </div>
          ))}
        </div>

        <div className="audience__footer">
          <p className="audience__note">
            Você terá <strong>acesso imediato</strong> ao GRUPO Elite Builders e todo conteúdo exclusivo para dar o primeiro passo hoje mesmo.
          </p>
        </div>
      </div>
    </section>
  );
}

