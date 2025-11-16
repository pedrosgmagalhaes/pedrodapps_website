import React from "react";
import "./FAQ.css";
import pixleyMobile from "../assets/pixley_app.png"; 
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    q: "O que o Pedro dApps entrega para os usuários da Pixley Wallet?",
    a: "O Pedro dApps oferece conhecimento, ferramentas e automações que potencializam o uso da Pixley Wallet. Isso inclui acesso a scripts, lives técnicas, suporte avançado e orientação prática para operar via DeFi com vantagem real.",
  },
  {
    q: "O que é o Builder Elite Club e por que ele é importante para quem usa a Pixley Wallet?",
    a: "O Builder Elite Club (R$ 987,58 por ano) é o plano premium que desbloqueia todo o ecossistema: acesso ao acervo completo de scripts de automação, lives fechadas semanais, GRUPO BUILDERS de ELITE, suporte dedicado e recursos exclusivos dentro do app.",
  },
  {
    q: "A Wallet funciona sem o Pedro dApps?",
    a: "Sim, mas de forma limitada. A wallet sozinha permite depósito/saque por PIX e operações básicas. Com o ecossistema Pedro dApps, você passa a ter automações, estratégias, comunidade e ferramentas que multiplicam o poder da wallet.",
  },
  {
    q: "Quais benefícios exclusivos o assinante Premium recebe dentro do app?",
    a: "Acesso total ao acervo de scripts\nLimites ampliados (até R$100 mil/dia e análise até R$10 milhões)\nTarifas reduzidas\nTarifa de saque de apenas R$1\nRecursos avançados dentro da wallet\nSuporte dedicado (Gerente de Conta)\nLives fechadas e comunidade VIP",
  },
  {
    q: "O Pedro dApps ensina como usar os scripts dentro da Pixley Wallet?",
    a: "Sim. As lives fechadas, os tutoriais e o GRUPO BUILDERS de ELITE explicam passo a passo como usar cada automação dentro da Pixley, garantindo segurança e resultado.",
  },
  {
    q: "É necessário saber programar para usar os scripts do Pedro dApps?",
    a: "Não. Os scripts são prontos e você aprende a aplicar sem experiência técnica. Para quem deseja personalização, há oferta premium para scripts sob medida.",
  },
  {
    q: "Como os limites e taxas funcionam dentro da Pixley Wallet?",
    a: "Cada plano possui tarifas e limites específicos já incluídos no pacote. Não há cobranças escondidas. O Premium oferece os menores custos e os maiores limites.",
  },
  {
    q: "A Pixley Wallet opera no Brasil com reais?",
    a: "As operações ocorrem em offshore, fora do Brasil. A Pixley Wallet não opera diretamente com reais; saldos e operações são em cripto. Entrada e saída em BRL podem ocorrer via parceiros (incluindo PIX), quando disponível.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState(0);
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
              <li className={`faq__item ${openIndex === idx ? "faq__item--open" : ""}`} key={idx}>
                <span className="faq__bullet" aria-hidden="true">{idx + 1}</span>
                <div className="faq__content">
                  <button
                    className="faq__question-btn"
                    aria-expanded={openIndex === idx}
                    aria-controls={`faq-panel-${idx}`}
                    id={`faq-header-${idx}`}
                    onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                    title={openIndex === idx ? "Clique para recolher" : "Clique para ver mais"}
                  >
                    <h3 className="faq__question">{item.q}</h3>
                    <span className="faq__toggle-hint">
                      <FaChevronDown
                        className={`faq__chevron ${openIndex === idx ? "is-open" : ""}`}
                        aria-hidden="true"
                        size={14}
                      />
                    </span>
                  </button>
                  <div
                    className="faq__panel"
                    id={`faq-panel-${idx}`}
                    role="region"
                    aria-labelledby={`faq-header-${idx}`}
                    aria-hidden={openIndex !== idx}
                  >
                    <div className="faq__answer">
                      {item.a.includes("\n") ? (
                        <ul className="faq__answer-list" aria-label="Benefícios do Premium">
                          {item.a.split("\n").map((line, i) => (
                            <li key={i}>{line.trim()}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{item.a}</p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="faq__right">
          <div className="faq__device">
            <img src={pixleyMobile} alt="Prévia whitelabel do app" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
