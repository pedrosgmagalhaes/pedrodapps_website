import React from "react";
import "./Policies.css";

export default function ServicesPolicy() {
  return (
    <section className="policy" id="servicos" aria-labelledby="policy-title">
      <div className="policy__container">
        <div className="policy__card" role="article" aria-describedby="policy-desc">
          <header>
            <h2 id="policy-title" className="policy__title">
              Política de Serviços
            </h2>
            <p id="policy-desc" className="policy__subtitle">
              Condições de uso para ebooks, cursos, lançamentos, lives ao vivo e scripts de
              automação financeira.
            </p>
          </header>

          {/* 1. Objetivo e escopo */}
          <div className="policy__section">
            <p>
              <strong>Objetivo e escopo</strong>
            </p>
            <p>
              Estes Termos regulam o acesso e o uso de produtos e serviços digitais oferecidos pelo
              Pedro dApps, incluindo ebooks, cursos gravados, lançamentos de cursos, mentorias em
              grupo, workshops, eventos e lives ao vivo, comunidades e materiais complementares.
            </p>
          </div>

          {/* 2. Inscrição, acesso e requisitos */}
          <div className="policy__section">
            <p>
              <strong>Inscrição, acesso e requisitos</strong>
            </p>
            <ul>
              <li>Fornecer dados verdadeiros e atualizados ao se inscrever ou comprar.</li>
              <li>Manter credenciais de acesso em sigilo e sob sua responsabilidade.</li>
              <li>
                Utilizar dispositivos compatíveis e conexão estável para acessar conteúdos e lives.
              </li>
              <li>
                O acesso é individual, intransferível e sujeito à disponibilidade técnica da
                plataforma.
              </li>
            </ul>
          </div>

          {/* 3. Pagamentos, assinaturas e cobranças */}
          <div className="policy__section">
            <p>
              <strong>Pagamentos, assinaturas e cobranças</strong>
            </p>
            <ul>
              <li>Pagamentos via PIX, boleto, cartão e outras formas disponíveis.</li>
              <li>
                Compras podem incluir pré-venda; acesso é liberado conforme cronograma do
                lançamento.
              </li>
              <li>Assinaturas possuem cobranças recorrentes até cancelamento pelo usuário.</li>
              <li>Falhas de pagamento podem suspender o acesso até regularização.</li>
              <li>
                Valores promocionais e bônus podem ser por tempo limitado e sujeitos a alterações.
              </li>
            </ul>
          </div>

          {/* 4. Reembolsos e cancelamentos */}
          <div className="policy__section">
            <p>
              <strong>Reembolsos e cancelamentos</strong>
            </p>
            <ul>
              <li>Solicitações de reembolso observam a política informada na página do produto.</li>
              <li>
                Ebooks e conteúdos digitais entregues podem não ser reembolsáveis após
                acesso/download.
              </li>
              <li>
                Para cursos e lives, cancelamentos seguem prazo e condições do lote/lançamento.
              </li>
              <li>Eventos ao vivo podem ser remarcados por motivos técnicos ou de força maior.</li>
            </ul>
          </div>

          {/* 5. Conteúdo e propriedade intelectual */}
          <div className="policy__section">
            <p>
              <strong>Conteúdo e propriedade intelectual</strong>
            </p>
            <ul>
              <li>Licença limitada, pessoal e não exclusiva para uso do conteúdo adquirido.</li>
              <li>
                É proibido compartilhar, revender, gravar, publicar ou distribuir materiais sem
                autorização.
              </li>
              <li>Marcas, aulas e materiais permanecem propriedade do Pedro dApps e parceiros.</li>
              <li>
                Participações em lives e comunidades devem respeitar direitos de imagem e
                privacidade de todos.
              </li>
            </ul>
          </div>

          {/* Licença e uso de scripts de automação financeira */}
          <div className="policy__section">
            <p>
              <strong>Licença e uso de scripts de automação financeira</strong>
            </p>
            <ul>
              <li>
                Concedemos licença limitada, pessoal, não exclusiva e intransferível para uso
                educacional dos scripts disponibilizados.
              </li>
              <li>
                Os scripts não constituem aconselhamento, sinais, gestão de carteira ou qualquer
                atividade regulada; uso indevido é proibido.
              </li>
              <li>
                Você deve observar termos, políticas e limites de terceiros (APIs, exchanges,
                bancos, gateways de pagamento), sendo responsável por credenciais e conformidade.
              </li>
              <li>
                Não garantimos interoperabilidade com serviços de terceiros; alterações externas
                podem afetar o funcionamento sem aviso prévio.
              </li>
              <li>
                Utilize automações com cautela, teste em ambiente controlado e mantenha práticas de
                segurança (logs, backups, limites).
              </li>
              <li>
                É vedado contornar medidas técnicas, realizar engenharia reversa não permitida ou
                scraping abusivo.
              </li>
            </ul>
          </div>

          {/* 6. Lives, mentorias e gravações */}
          <div className="policy__section">
            <p>
              <strong>Lives, mentorias e gravações</strong>
            </p>
            <ul>
              <li>
                Programação e horários podem sofrer ajustes; avisos serão enviados por e-mail ou
                canais oficiais.
              </li>
              <li>
                Gravações podem ser disponibilizadas por período determinado, sujeitas a qualidade
                técnica.
              </li>
              <li>
                Ao participar, você concorda com normas de conduta, uso de câmeras/microfones e
                eventuais registros.
              </li>
              <li>
                Mentorias em grupo priorizam respeito e colaboração; moderadores podem intervir
                quando necessário.
              </li>
            </ul>
          </div>

          {/* 7. Comunidade e conduta */}
          <div className="policy__section">
            <p>
              <strong>Comunidade e conduta</strong>
            </p>
            <ul>
              <li>
                Proibido assédio, discriminação, spam, pirataria e autopromoção não autorizada.
              </li>
              <li>Respeitar moderadores, regras dos grupos e diretrizes de convivência.</li>
              <li>O descumprimento pode resultar em suspensão ou exclusão sem reembolso.</li>
            </ul>
          </div>

          {/* 8. Riscos e limitações */}
          <div className="policy__section">
            <p>
              <strong>Riscos e limitações</strong>
            </p>
            <ul>
              <li>
                Mercados e contextos de negócios são voláteis; preços, demanda e liquidez podem
                variar significativamente.
              </li>
              <li>
                Riscos tecnológicos incluem falhas de sistemas, indisponibilidade de plataformas,
                ataques, perda de acesso e outros eventos fora do nosso controle.
              </li>
              <li>
                Decisões de estudo, implementação e investimento são de responsabilidade exclusiva
                do usuário; faça sua própria diligência.
              </li>
              <li>
                Perdas financeiras e de desempenho são possíveis; não garantimos resultados,
                retornos ou prazos.
              </li>
              <li>
                Nossos materiais não são oferta, solicitação ou convite para compra/venda de ativos
                ou contratação de serviços financeiros.
              </li>
            </ul>
          </div>

          {/* 9. Resultados e responsabilidade */}
          <div className="policy__section">
            <p>
              <strong>Resultados e responsabilidade</strong>
            </p>
            <p>
              O conteúdo é educacional e não garante resultados financeiros ou de desempenho.
              Decisões e implementações são de responsabilidade do usuário.
            </p>
            <ul>
              <li>Não vendemos criptomoedas, ativos financeiros ou produtos de investimento.</li>
              <li>
                Não oferecemos recomendação, consultoria ou aconselhamento financeiro, jurídico ou
                fiscal.
              </li>
              <li>
                Os conteúdos não constituem oferta, solicitação ou convite para compra/venda de
                ativos.
              </li>
              <li>
                Antes de investir, consulte profissionais qualificados; riscos são assumidos pelo
                usuário.
              </li>
            </ul>
          </div>

          {/* 10. Atualizações, bônus e acesso */}
          <div className="policy__section">
            <p>
              <strong>Atualizações, bônus e acesso</strong>
            </p>
            <ul>
              <li>
                Conteúdos podem ser atualizados; bônus e materiais extras podem mudar ao longo do
                tempo.
              </li>
              <li>
                “Acesso vitalício” refere-se à vida útil do curso/produto na plataforma, sujeito a
                manutenção.
              </li>
              <li>Preços, condições e pacotes podem ser ajustados em novos lotes ou turmas.</li>
            </ul>
          </div>

          {/* 11. Suporte e comunicação */}
          <div className="policy__section">
            <p>
              <strong>Suporte e comunicação</strong>
            </p>
            <ul>
              <li>Suporte é prestado pelos canais oficiais informados no site.</li>
              <li>
                Comunicados importantes podem ocorrer por e-mail, WhatsApp ou dentro da plataforma.
              </li>
              <li>
                Você pode gerenciar preferências de comunicação e marketing a qualquer momento.
              </li>
            </ul>
          </div>

          {/* Exclusão de garantias */}
          <div className="policy__section">
            <p>
              <strong>Exclusão de garantias</strong>
            </p>
            <p>
              Os serviços, conteúdos e scripts são fornecidos "no estado em que se encontram" e
              "conforme disponibilidade", sem garantias de qualquer natureza, expressas ou
              implícitas, incluindo, sem limitação, comerciabilidade, adequação a um propósito
              específico, não violação e disponibilidade contínua.
            </p>
            <p>
              O conteúdo é educacional e informativo; resultados variam conforme implementação e
              contexto. Na extensão permitida pela lei, excluímos quaisquer garantias relacionadas a
              desempenho, interoperabilidade com terceiros ou resultados esperados.
            </p>
          </div>

          {/* Limitação de responsabilidade */}
          <div className="policy__section">
            <p>
              <strong>Limitação de responsabilidade</strong>
            </p>
            <ul>
              <li>
                Na medida máxima permitida pela lei, não seremos responsáveis por danos indiretos,
                incidentais, especiais, punitivos, exemplares ou lucros cessantes.
              </li>
              <li>
                A responsabilidade total por quaisquer danos diretos decorrentes do uso dos serviços
                está limitada ao montante efetivamente pago por você nos 12 meses anteriores ao
                evento.
              </li>
              <li>
                Não respondemos por falhas, indisponibilidades, alterações de terceiros ou eventos
                de força maior que afetem a prestação dos serviços.
              </li>
            </ul>
          </div>

          {/* Indenização */}
          <div className="policy__section">
            <p>
              <strong>Indenização</strong>
            </p>
            <p>
              Você concorda em indenizar, defender e isentar o Pedro dApps e seus parceiros de
              quaisquer reclamações, perdas, responsabilidades, custos e despesas (incluindo
              honorários advocatícios) decorrentes do uso indevido dos serviços ou scripts, violação
              destes Termos, infração de direitos de terceiros ou descumprimento regulatório.
            </p>
          </div>

          {/* Suspensão e rescisão */}
          <div className="policy__section">
            <p>
              <strong>Suspensão e rescisão</strong>
            </p>
            <ul>
              <li>
                Podemos suspender ou rescindir seu acesso em caso de violação destes Termos, conduta
                inadequada ou risco à operação/terceiros, sem reembolso quando houver infração
                grave.
              </li>
              <li>
                Você pode rescindir seu acesso cancelando assinaturas ou solicitando encerramento
                conforme as condições do produto.
              </li>
              <li>
                Determinados efeitos persistem após rescisão (por exemplo, restrições de propriedade
                intelectual e limitações de responsabilidade).
              </li>
            </ul>
          </div>

          {/* 12. Compliance e proibições */}
          <div className="policy__section">
            <p>
              <strong>Compliance e proibições</strong>
            </p>
            <ul>
              <li>
                É vedado captar recursos, prometer rentabilidade, operar sinais ou oferecer gestão
                de carteira.
              </li>
              <li>
                Não realizamos intermediação, compra/venda ou custódia de criptomoedas/ativos
                financeiros.
              </li>
              <li>
                Não fornecemos aconselhamento financeiro, jurídico ou fiscal; conteúdo é
                educacional.
              </li>
              <li>
                Proibidos esquemas de pirâmide, multi-nível, golpes ou qualquer prática ilícita.
              </li>
            </ul>
          </div>

          {/* 13. Alterações e vigência */}
          <div className="policy__section">
            <p>
              <strong>Alterações e vigência</strong>
            </p>
            <p>
              Estes Termos podem ser atualizados para refletir melhorias, novos formatos
              (lançamentos, turmas, lives) e requisitos legais. Recomendamos revisão periódica.
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
