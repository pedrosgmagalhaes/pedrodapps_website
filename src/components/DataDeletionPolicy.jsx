import React from "react";
import "./Policies.css";

export default function DataDeletionPolicy() {
  return (
    <section className="policy" id="exclusao-dados" aria-labelledby="policy-title">
      <div className="policy__container">
        <div className="policy__card" role="article" aria-describedby="policy-desc">
          <header>
            <h2 id="policy-title" className="policy__title">Política de Exclusão de Dados</h2>
            <p id="policy-desc" className="policy__subtitle">Como solicitar e como tratamos a exclusão dos seus dados.</p>
          </header>

          <div className="policy__section">
            <h3>Solicitação de exclusão</h3>
            <p>Você pode solicitar exclusão entrando em contato pelo e-mail de suporte informado no site.</p>
          </div>

          <div className="policy__section">
            <h3>Prazo e escopo</h3>
            <p>Excluiremos dados pessoais identificáveis em até 30 dias, mantendo apenas o mínimo necessário para obrigações legais.</p>
          </div>

          <div className="policy__section">
            <h3>Exceções legais</h3>
            <p>Determinados registros de transação podem ser retidos conforme exigências regulatórias e fiscais.</p>
          </div>

          <div className="policy__updated">Última atualização: {new Date().toLocaleDateString()}</div>
        </div>
      </div>
    </section>
  );
}