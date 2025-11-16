import React from "react";
import "./Policies.css";

export default function ServicesPolicy() {
  return (
    <section className="policy" id="servicos" aria-labelledby="policy-title">
      <div className="policy__container">
        <div className="policy__card" role="article" aria-describedby="policy-desc">
          <header>
            <h2 id="policy-title" className="policy__title">Política de Serviços (Termos de Uso)</h2>
            <p id="policy-desc" className="policy__subtitle">Regras de uso, direitos e responsabilidades.</p>
          </header>

          <div className="policy__section">
            <h3>Elegibilidade</h3>
            <p>Você deve fornecer informações verdadeiras e manter suas credenciais em segurança.</p>
          </div>

          <div className="policy__section">
            <h3>Licença de uso</h3>
            <p>Oferecemos acesso a conteúdos e ferramentas, não transferindo propriedade intelectual.</p>
          </div>

          <div className="policy__section">
            <h3>Pagamentos</h3>
            <p>Pagamentos podem ser realizados via PIX, Boleto e Cartão. Em caso de falha, o acesso pode ser suspenso até regularização.</p>
          </div>

          <div className="policy__section">
            <h3>Limitações</h3>
            <p>É vedado uso indevido, engenharia reversa e compartilhamento não autorizado de conteúdos.</p>
          </div>

          <div className="policy__updated">Última atualização: {new Date().toLocaleDateString()}</div>
        </div>
      </div>
    </section>
  );
}