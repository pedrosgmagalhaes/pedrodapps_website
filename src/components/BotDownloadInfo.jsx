import React, { useState } from "react";
import { FaDownload, FaInfoCircle, FaListUl, FaCogs, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

export default function BotDownloadInfo({
  title = "Honeypot & Rug Pull Detector — Download",
  version = "v1.0.0",
  changelogUrl,
  downloadUrl = "/vite.svg",
  requirements = [
    "Sistema: Windows, macOS ou Linux",
    "Node.js 18+ ou Python 3.10+ (dependendo da versão do bot)",
    "Acesso à internet estável",
    "Carteira compatível (para simulações de rede)",
  ],
  howItWorks = [
    "Analisa contratos e transações para detectar padrões de honeypot",
    "Valida funções comuns de bloqueio/whitelist/blacklist e taxas de venda",
    "Simula transferências com parâmetros de slippage e rede",
    "Gera um relatório com avisos e indicadores de risco",
  ],
  notes = [
    "Use em ambiente de testes antes de operar com valores reais",
    "Mantenha o bot atualizado para obter as heurísticas mais recentes",
  ],
  onDownload,
}) {
  const [accepted, setAccepted] = useState(false);

  const handleAnchorDownload = (e) => {
    if (!accepted) {
      e.preventDefault();
    }
  };

  return (
    <section className="botinfo" aria-labelledby="botinfo-title">
      <header className="botinfo__header">
        <h2 id="botinfo-title" className="botinfo__title">{title}</h2>
        <div className="botinfo__meta">
          <span className="botinfo__version">Versão: {version}</span>
          {changelogUrl && (
            <a className="botinfo__link" href={changelogUrl} target="_blank" rel="noreferrer">Changelog</a>
          )}
        </div>
      </header>

      <div className="botinfo__grid">
        <div className="botinfo__card">
          <div className="botinfo__card-title"><FaInfoCircle aria-hidden="true" /> Versões e Atualizações</div>
          <p className="botinfo__text">
            Este bot segue versionamento semântico (MAJOR.MINOR.PATCH). Atualizações podem incluir
            correções, melhorias de heurísticas e suporte a novas redes. Consulte o changelog quando disponível.
          </p>
        </div>

        <div className="botinfo__card">
          <div className="botinfo__card-title"><FaCogs aria-hidden="true" /> Como funciona</div>
          <ul className="botinfo__list" role="list">
            {howItWorks.map((item, idx) => (
              <li key={idx} className="botinfo__list-item">{item}</li>
            ))}
          </ul>
        </div>

        <div className="botinfo__card">
          <div className="botinfo__card-title"><FaListUl aria-hidden="true" /> Requisitos</div>
          <ul className="botinfo__list" role="list">
            {requirements.map((req, idx) => (
              <li key={idx} className="botinfo__list-item">{req}</li>
            ))}
          </ul>
        </div>

        {notes?.length ? (
          <div className="botinfo__card">
            <div className="botinfo__card-title"><FaInfoCircle aria-hidden="true" /> Observações</div>
            <ul className="botinfo__list" role="list">
              {notes.map((n, idx) => (
                <li key={idx} className="botinfo__list-item">{n}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="botinfo__disclaimer" role="note" aria-label="Aviso legal">
        <FaExclamationTriangle aria-hidden="true" />
        <div>
          <strong>Aviso Legal:</strong> Este aplicativo é disponibilizado "no estado em que se encontra" e destina-se
          exclusivamente a fins educacionais. Ao realizar o download, o usuário declara estar ciente de que: (i) o uso
          é de sua exclusiva responsabilidade; (ii) recomenda-se utilização segura, preferencialmente em ambiente de
          testes e com valores reduzidos; (iii) não são oferecidas garantias, expressas ou implícitas, quanto à
          adequação, desempenho, disponibilidade ou resultados; e (iv) os autores não se responsabilizam por perdas,
          danos, fraudes, interrupções ou quaisquer prejuízos decorrentes do uso.
        </div>
      </div>

      <label className="botinfo__terms" aria-label="Aceite do termo de responsabilidade">
        <span className="botinfo__terms-inputwrap">
          <input
            id="botinfo-accept"
            type="checkbox"
            className="botinfo__terms-checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            aria-checked={accepted}
          />
        </span>
        <span className="botinfo__terms-label">
          Declaro que li, compreendi e <span className="botinfo__terms-accept">ACEITO</span> integralmente o aviso legal acima. Concordo em
          utilizar o aplicativo com cautela, preferencialmente em ambiente de testes e com valores reduzidos.
        </span>
      </label>

      <div className="botinfo__actions">
        {onDownload ? (
          <button
            type="button"
            className="botinfo__btn-download"
            onClick={accepted ? onDownload : undefined}
            disabled={!accepted}
            aria-disabled={!accepted}
            aria-describedby="botinfo-accept"
            title={accepted ? "Baixar o bot" : "Marque o aceite para liberar o download"}
          >
            <FaDownload aria-hidden="true" /> Download do Bot
          </button>
        ) : (
          <a
            className={`botinfo__btn-download ${accepted ? "" : "is-disabled"}`}
            href={downloadUrl}
            download
            onClick={handleAnchorDownload}
            aria-disabled={!accepted}
            aria-describedby="botinfo-accept"
            title={accepted ? "Baixar o bot" : "Marque o aceite para liberar o download"}
          >
            <FaDownload aria-hidden="true" /> Download do Bot
          </a>
        )}
      </div>
    </section>
  );
}