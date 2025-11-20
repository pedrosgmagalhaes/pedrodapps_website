import React from "react";
import "./Policies.css";

export default function PrivacyPolicy() {
  return (
    <section className="policy" id="privacidade" aria-labelledby="policy-title">
      <div className="policy__container">
        <div className="policy__card" role="article" aria-describedby="policy-desc">
          <header>
            <h2 id="policy-title" className="policy__title">
              Política de Privacidade
            </h2>
            <p id="policy-desc" className="policy__subtitle">
              Como tratamos seus dados pessoais com segurança, transparência e conformidade.
            </p>
          </header>

          {/* 1. Objetivo e escopo */}
          <div className="policy__section">
            <p>
              <strong>Objetivo e escopo</strong>
            </p>
            <p>
              Esta Política de Privacidade descreve como o Pedro dApps coleta, utiliza, compartilha
              e protege seus dados pessoais ao utilizar nosso site e demais serviços digitais que
              operamos. Nosso compromisso é garantir transparência, segurança e conformidade com a
              legislação aplicável.
            </p>
          </div>

          {/* 2. Dados pessoais coletados */}
          <div className="policy__section">
            <p>
              <strong>Dados pessoais coletados</strong>
            </p>
            <ul>
              <li>
                Nome, e-mail e informações fornecidas voluntariamente para criação de conta ou
                compra.
              </li>
              <li>
                Páginas acessadas, eventos de uso, endereço IP, tipo de dispositivo e navegador, de
                forma agregada e/ou pseudonimizada.
              </li>
              <li>
                Mensagens trocadas conosco (por e-mail ou formulários), preferências e histórico de
                atendimento.
              </li>
              <li>
                Dados necessários ao processamento por provedores de pagamento, sem armazenarmos
                dados sensíveis de cartão.
              </li>
            </ul>
          </div>

          {/* 3. Bases legais e finalidades */}
          <div className="policy__section">
            <p>
              <strong>Bases legais e finalidades</strong>
            </p>
            <ul>
              <li>Viabilizar sua compra, acesso e suporte aos serviços.</li>
              <li>Envio de comunicações, newsletter e uso de determinados cookies.</li>
              <li>Registros necessários para cumprimento de exigências legais.</li>
              <li>Melhoria de experiência, segurança e manutenção de nossos sistemas.</li>
            </ul>
          </div>

          {/* 4. Uso dos dados */}
          <div className="policy__section">
            <p>
              <strong>Uso dos dados</strong>
            </p>
            <p>
              Utilizamos seus dados para autenticação, atendimento, comunicação sobre pedidos e
              melhorias contínuas dos serviços. Não vendemos dados pessoais.
            </p>
            <p>
              Nosso conteúdo é estritamente educacional e informativo. Não comercializamos
              criptomoedas ou ativos financeiros, nem oferecemos recomendações de investimento,
              consultoria financeira, jurídica ou fiscal. Os materiais não constituem oferta,
              solicitação ou convite para compra/venda de ativos.
            </p>
          </div>

          {/* 4A. Scripts, interoperabilidade e provedores de terceiros */}
          <div className="policy__section">
            <p>
              <strong>Scripts, interoperabilidade e provedores de terceiros</strong>
            </p>
            <p>
              Algumas funcionalidades opcionais podem envolver o uso de scripts de automação para
              integração com serviços de terceiros (por exemplo, instituições de pagamento e bancos,
              gateways/PSPs, agentes liquidantes, exchanges nacionais e internacionais e exchanges
              descentralizadas — DEX). A interoperabilidade depende dos termos, políticas e
              disponibilidade desses provedores.
            </p>
            <p>
              O tratamento de dados associado a tais integrações não amplia o escopo de dados
              pessoais previsto nesta Política. Quando aplicável, limita-se a metadados técnicos,
              registros de uso e credenciais ou chaves de API fornecidas pelo próprio usuário para
              viabilizar a integração, sempre observando segurança, minimização e finalidade.
            </p>
            <p>
              Quando a integração se dá com provedores financeiros, quaisquer dados de transação,
              verificação de identidade (KYC), conformidade ou antifraude são coletados e tratados
              diretamente por esses terceiros conforme suas políticas; atuamos apenas como
              facilitadores técnicos da conexão.
            </p>
            <p>
              Ao optar por integrar serviços de terceiros, você concorda que a coleta e o
              processamento por esses provedores são regidos pelas respectivas políticas e termos.
              Recomendamos revisar atentamente as condições de cada serviço externo antes de
              habilitar qualquer integração.
            </p>
            <p>
              Em integrações com protocolos descentralizados, algumas informações podem ser
              registradas publicamente em redes blockchain e não são passíveis de exclusão por nós.
              Considere esses aspectos antes de habilitar integrações desse tipo.
            </p>
          </div>

          {/* 5. Compartilhamento de dados */}
          <div className="policy__section">
            <p>
              <strong>Compartilhamento de dados</strong>
            </p>
            <ul>
              <li>Para processar transações com segurança.</li>
              <li>Para operar o site com desempenho e disponibilidade.</li>
              <li>
                Para métricas de uso e exibição de anúncios, respeitando configurações de cookies.
              </li>
              <li>Quando requerido por lei ou ordem administrativa/judicial.</li>
            </ul>
          </div>

          {/* 6. Retenção e eliminação */}
          <div className="policy__section">
            <p>
              <strong>Retenção e eliminação</strong>
            </p>
            <p>
              Mantemos os dados pelo tempo necessário ao cumprimento das finalidades desta Política
              e de obrigações legais, eliminando-os com segurança quando não mais necessários.
              Backups podem manter registros por prazo adicional estritamente operacional.
            </p>
          </div>

          {/* 7. Segurança da informação */}
          <div className="policy__section">
            <p>
              <strong>Segurança da informação</strong>
            </p>
            <p>
              Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra
              acesso, uso, alteração, divulgação ou destruição não autorizados.
            </p>
          </div>

          {/* 8. Cookies e publicidade */}
          <div className="policy__section">
            <p>
              <strong>Cookies e publicidade</strong>
            </p>
            <p>
              Utilizamos cookies para melhorar sua experiência e personalizar conteúdo. Serviços
              como Google AdSense podem empregar o cookie DoubleClick para exibir anúncios mais
              relevantes e limitar repetições. Para detalhes, consulte nossa{" "}
              <a href="/cookies">Política de Cookies</a>.
            </p>
          </div>

          {/* 9. Parceiros e afiliados */}
          <div className="policy__section">
            <p>
              <strong>Parceiros e afiliados</strong>
            </p>
            <p>
              Alguns parceiros anunciam em nosso nome. Cookies de rastreamento de afiliados permitem
              reconhecer acessos originados desses parceiros para correta atribuição de campanhas e
              benefícios.
            </p>
          </div>

          {/* 10. Direitos do titular */}
          <div className="policy__section">
            <p>
              <strong>Direitos do titular</strong>
            </p>
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
            <p>
              <strong>Contato</strong>
            </p>
            <p>
              Em caso de dúvidas sobre esta Política ou sobre o tratamento de seus dados, entre em
              contato pelo e-mail de suporte informado no site.
            </p>
          </div>

          {/* 12. Atualizações e vigência */}
          <div className="policy__section">
            <p>
              <strong>Atualizações e vigência</strong>
            </p>
            <p>
              Esta Política pode ser atualizada para refletir melhorias e requisitos legais.
              Recomendamos a revisão periódica.
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