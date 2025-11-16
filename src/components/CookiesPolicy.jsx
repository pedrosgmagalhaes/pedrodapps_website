import React from "react";
import "./Policies.css";

export default function CookiesPolicy() {
  return (
    <section className="policy" id="cookies" aria-labelledby="policy-title">
      <div className="policy__container">
        <div className="policy__card" role="article" aria-describedby="policy-desc">
          <header>
            <h2 id="policy-title" className="policy__title">Política de Cookies</h2>
            <p id="policy-desc" className="policy__subtitle">Como utilizamos cookies para melhorar a experiência, com transparência e controle.</p>
          </header>

          {/* 1. O que são cookies */}
          <div className="policy__section">
            <p><strong>O que são cookies</strong></p>
            <p>
              Cookies são pequenos arquivos armazenados no seu dispositivo que ajudam a lembrar preferências, manter sessões ativas e melhorar a navegação. Também podem ser usados para métricas de uso e exibição de conteúdo relevante.
            </p>
          </div>

          {/* 2. Tipos de cookies */}
          <div className="policy__section">
            <p><strong>Tipos de cookies</strong></p>
            <ul>
              <li>Garantem o funcionamento básico do site e autenticação.</li>
              <li>Ajudam a entender uso, medir desempenho e aprimorar conteúdos.</li>
              <li>Lembram suas escolhas, como idioma e preferências de interface.</li>
              <li>Personalizam anúncios e limitam repetições com base em interesses.</li>
            </ul>
          </div>

          {/* 3. Cookies que podemos utilizar */}
          <div className="policy__section">
            <p><strong>Cookies que podemos utilizar</strong></p>
            <ul>
              <li>Manutenção de sessão e autenticação.</li>
              <li>Preferências de usuário e experiência.</li>
              <li>Analytics para métricas agregadas de uso.</li>
              <li>Publicidade por parceiros, como o cookie DoubleClick para anúncios relevantes e limitação de repetição.</li>
            </ul>
            <p>
              Para mais detalhes sobre tratamento de dados, consulte nossa <a href="#privacidade">Política de Privacidade</a>.
            </p>
          </div>

          {/* 4. Gerenciamento de cookies */}
          <div className="policy__section">
            <p><strong>Gerenciamento de cookies</strong></p>
            <p>
              Você pode gerenciar e excluir cookies nas configurações do seu navegador. Alguns recursos podem não funcionar corretamente sem determinados cookies.
            </p>
            <ul>
              <li>Configurações de navegador para bloquear ou remover cookies.</li>
              <li>Preferências de anúncios para controlar personalização.</li>
              <li>Ferramentas de opt-out fornecidas por provedores de publicidade.</li>
            </ul>
          </div>

          {/* 5. Atualizações e contato */}
          <div className="policy__section">
            <p><strong>Atualizações e contato</strong></p>
            <p>
              Esta política pode ser atualizada para refletir melhorias e requisitos legais. Em caso de dúvidas, entre em contato pelo e-mail de suporte informado no site.
            </p>
          </div>
          <div className="policy__updated">Esta política é efetiva a partir de 15 de novembro, às 21:40</div>
        </div>
      </div>
    </section>
  );
}