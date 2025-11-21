import React from "react";
import "./ScriptsShowcase.css";

const SCRIPTS = [
  "Sniper Bot seguro (sem frontrunning ilegal)",
  "Liquidity Sniper (detecta LP Add + auto buy)",
  "Auto-Compound DeFi (claim → swap → reinvest)",
  "Monitor de Pools (APR, TVL, novas farms)",
  "Whale Tracker (alertas de baleias)",
  "Bot de Rebalanceamento",
  "Ferramentas anti-rug e anti-honeypot",
  "Templates ERC20 avançados (taxas, anti-bot, anti-whale)",
  "Scripts para pré-vendas (PinkSale, DXSale)",
  "Automações Telegram",
];

export default function ScriptsShowcase() {
  return (
    <section className="scripts" id="scripts" aria-label="Exemplos de scripts e automações">
      <div className="container scripts__container">
        <header className="scripts__header">
          <span className="scripts__eyebrow">AUTOMAÇÕES</span>
          <h2 className="scripts__title">Scripts e ferramentas que você acessa</h2>
          <p className="scripts__subtitle">
            Operação via DeFi com automações profissionais — segurança, velocidade e resultado.
          </p>
        </header>

        <ul className="scripts__grid">
          {SCRIPTS.map((text, i) => (
            <li className="scripts__item" key={i}>
              <span className="scripts__bullet" aria-hidden="true">
                {i + 1}
              </span>
              <span className="scripts__text">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
