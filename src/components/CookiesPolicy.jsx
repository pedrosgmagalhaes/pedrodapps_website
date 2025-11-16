import React from "react";
import "./Policies.css";

export default function CookiesPolicy() {
  return (
    <section className="policy" id="cookies" aria-labelledby="policy-title">
      <div className="policy__container">
        <div className="policy__card" role="article" aria-describedby="policy-desc">
          <header>
            <h2 id="policy-title" className="policy__title">Política de Cookies</h2>
            <p id="policy-desc" className="policy__subtitle">Como e por que utilizamos cookies.</p>
          </header>

          <div className="policy__section">
            <h3>O que são cookies</h3>
            <p>Cookies são pequenos arquivos usados para lembrar preferências e melhorar a experiência.</p>
          </div>

          <div className="policy__section">
            <h3>Tipos de cookies</h3>
            <ul>
              <li>Essenciais: necessários para o funcionamento do site.</li>
              <li>Desempenho: ajudam a entender uso e melhorar conteúdos.</li>
              <li>Funcionais: lembram suas escolhas e preferências.</li>
            </ul>
          </div>

          <div className="policy__section">
            <h3>Gerenciamento</h3>
            <p>Você pode gerenciar cookies nas configurações do seu navegador.</p>
          </div>

          <div className="policy__updated">Última atualização: {new Date().toLocaleDateString()}</div>
        </div>
      </div>
    </section>
  );
}