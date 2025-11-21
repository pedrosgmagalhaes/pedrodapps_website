import React from "react";
import "./Policies.css";

export default function DataDeletionPolicy() {
  return (
    <section className="policy" id="exclusao-dados" aria-labelledby="policy-title">
      <div className="policy__container">
        <div className="policy__card" role="article" aria-describedby="policy-desc">
          <header>
            <h2 id="policy-title" className="policy__title">
              Política de Exclusão de Dados
            </h2>
            <p id="policy-desc" className="policy__subtitle">
              Procedimentos, prazos e controles para exclusão de dados pessoais.
            </p>
          </header>

          {/* 1. Solicitação de exclusão */}
          <div className="policy__section">
            <p>
              <strong>Solicitação de exclusão</strong>
            </p>
            <ul>
              <li>Solicitar exclusão pelo e-mail de suporte informado no site.</li>
              <li>Fornecer dados necessários à verificação de identidade.</li>
            </ul>
          </div>

          {/* 2. Prazo e escopo */}
          <div className="policy__section">
            <p>
              <strong>Prazo e escopo</strong>
            </p>
            <ul>
              <li>Exclusão de dados pessoais identificáveis em até 30 dias.</li>
              <li>Retenção mínima apenas para cumprimento de obrigações legais/regulatórias.</li>
            </ul>
          </div>

          {/* 3. Exceções e retenções legais */}
          <div className="policy__section">
            <p>
              <strong>Exceções e retenções legais</strong>
            </p>
            <ul>
              <li>
                Registros de transação e documentos fiscais podem ser mantidos conforme exigências
                legais.
              </li>
              <li>
                Backups operacionais podem reter dados por prazo adicional estritamente técnico.
              </li>
            </ul>
          </div>

          {/* 4. Efeitos da exclusão */}
          <div className="policy__section">
            <p>
              <strong>Efeitos da exclusão</strong>
            </p>
            <ul>
              <li>Perda de acesso a serviços e conteúdos associados à conta.</li>
              <li>Impossibilidade de restauração de dados após conclusão do processo.</li>
            </ul>
          </div>

          {/* 5. Segurança e verificação */}
          <div className="policy__section">
            <p>
              <strong>Segurança e verificação</strong>
            </p>
            <p>
              O processo de exclusão emprega controles de segurança e validação de identidade para
              prevenir acessos indevidos.
            </p>
          </div>
          <div className="policy__updated">
            Esta política é efetiva a partir de 15 de novembro, às 21:40
          </div>
        </div>
      </div>
    </section>
  );
}
