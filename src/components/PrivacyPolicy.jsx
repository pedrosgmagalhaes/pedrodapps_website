import React from "react";
import "./Policies.css";

export default function PrivacyPolicy() {
  return (
    <section className="policy" id="privacidade" aria-labelledby="policy-title">
      <div className="policy__container">
        <div className="policy__card" role="article" aria-describedby="policy-desc">
          <header>
            <h2 id="policy-title" className="policy__title">Política de Privacidade</h2>
            <p id="policy-desc" className="policy__subtitle">Como tratamos seus dados pessoais com segurança, transparência e conformidade.</p>
          </header>

          {/* 1. Objetivo e escopo */}
          <div className="policy__section">
            <h3>Objetivo e escopo</h3>
            <p>
              Esta Política de Privacidade descreve como o Pedro dApps coleta, utiliza, compartilha e protege seus dados pessoais ao utilizar nosso site e demais serviços digitais que operamos. Nosso compromisso é garantir transparência, segurança e conformidade com a legislação aplicável.
            </p>
          </div>

          {/* 2. Dados pessoais coletados */}
          <div className="policy__section">
            <h3>Dados pessoais coletados</h3>
            <ul>
              <li>Nome, e-mail e informações fornecidas voluntariamente para criação de conta ou compra.</li>
              <li>Páginas acessadas, eventos de uso, endereço IP, tipo de dispositivo e navegador, de forma agregada e/ou pseudonimizada.</li>
              <li>Mensagens trocadas conosco (por e-mail ou formulários), preferências e histórico de atendimento.</li>
              <li>Dados necessários ao processamento por provedores de pagamento, sem armazenarmos dados sensíveis de cartão.</li>
            </ul>
          </div>

          {/* 3. Bases legais e finalidades */}
          <div className="policy__section">
            <h3>Bases legais e finalidades</h3>
            <ul>
              <li>Viabilizar sua compra, acesso e suporte aos serviços.</li>
              <li>Envio de comunicações, newsletter e uso de determinados cookies.</li>
              <li>Registros necessários para cumprimento de exigências legais.</li>
              <li>Melhoria de experiência, segurança e manutenção de nossos sistemas.</li>
            </ul>
          </div>

          {/* 4. Uso dos dados */}
          <div className="policy__section">
            <h3>Uso dos dados</h3>
            <p>
              Utilizamos seus dados para autenticação, atendimento, comunicação sobre pedidos e melhorias contínuas dos serviços. Não vendemos dados pessoais.
            </p>
          </div>

          {/* 5. Compartilhamento de dados */}
          <div className="policy__section">
            <h3>Compartilhamento de dados</h3>
            <ul>
              <li>Para processar transações com segurança.</li>
              <li>Para operar o site com desempenho e disponibilidade.</li>
              <li>Para métricas de uso e exibição de anúncios, respeitando configurações de cookies.</li>
              <li>Quando requerido por lei ou ordem administrativa/judicial.</li>
            </ul>
          </div>

          {/* 6. Retenção e eliminação */}
          <div className="policy__section">
            <h3>Retenção e eliminação</h3>
            <p>
              Mantemos os dados pelo tempo necessário ao cumprimento das finalidades desta Política e de obrigações legais, eliminando-os com segurança quando não mais necessários. Backups podem manter registros por prazo adicional estritamente operacional.
            </p>
          </div>

          {/* 7. Segurança da informação */}
          <div className="policy__section">
            <h3>Segurança da informação</h3>
            <p>
              Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso, uso, alteração, divulgação ou destruição não autorizados.
            </p>
          </div>

          {/* 8. Cookies e publicidade */}
          <div className="policy__section">
            <h3>Cookies e publicidade</h3>
            <p>
              Utilizamos cookies para melhorar sua experiência e personalizar conteúdo. Serviços como Google AdSense podem empregar o cookie DoubleClick para exibir anúncios mais relevantes e limitar repetições. Para detalhes, consulte nossa <a href="#cookies">Política de Cookies</a>.
            </p>
          </div>

          {/* 9. Parceiros e afiliados */}
          <div className="policy__section">
            <h3>Parceiros e afiliados</h3>
            <p>
              Alguns parceiros anunciam em nosso nome. Cookies de rastreamento de afiliados permitem reconhecer acessos originados desses parceiros para correta atribuição de campanhas e benefícios.
            </p>
          </div>

          {/* 10. Direitos do titular */}
          <div className="policy__section">
            <h3>Direitos do titular</h3>
            <ul>
              <li>Acesso, correção e atualização de dados pessoais.</li>
              <li>Portabilidade, exclusão e anonimização, nos termos da lei.</li>
              <li>Informações sobre uso e compartilhamento.</li>
              <li>Revogação de consentimento e oposição ao tratamento, quando aplicável.</li>
              <li>Reclamação à autoridade de proteção de dados, se necessário.</li>
            </ul>
          </div>

          {/* 11. Contato */}
          <div className="policy__section">
            <h3>Contato</h3>
            <p>
              Em caso de dúvidas sobre esta Política ou sobre o tratamento de seus dados, entre em contato pelo e-mail de suporte informado no site.
            </p>
          </div>

          {/* 12. Atualizações e vigência */}
          <div className="policy__section">
            <h3>Atualizações e vigência</h3>
            <p>
              Esta Política pode ser atualizada para refletir melhorias e requisitos legais. Recomendamos a revisão periódica.
            </p>
          </div>

          <div className="policy__updated">Esta política é efetiva a partir de 15 de novembro, às 21:40</div>
        </div>
      </div>
    </section>
  );
}