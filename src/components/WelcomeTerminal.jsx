import React, { useState } from "react";
import { FaPlay, FaSpinner } from "react-icons/fa";

export default function WelcomeTerminal({
  title = "Bem-vindo ao grupo Builders de Elite",
  description = "Conteúdos exclusivos para usuários avançados, vídeo aulas, download de bots, suporte e outros conteúdos riquíssimos.",
  promptLabel = "builders-de-elite:~$",
  inputPlaceholder = "digite um comando (ex.: hello)",
  runLabel = "EXECUTAR",
  codeLines = [
    'print("Hello World")',
    'print("Bem-vindo ao grupo Builders de Elite!")',
    '',
    'def build_house():',
    '  pass',
    'def test_structure():',
    '  pass',
    '',
    '# TODO: adicione seus próprios testes aqui',
    'print("Simulando...")',
  ],
  onRun,
}) {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState([]);
  const [running, setRunning] = useState(false);

  const run = () => {
    if (running) return;
    const cmd = command.trim();
    const effectiveCmd = cmd || "hello";
    const ts = new Date().toLocaleTimeString();

    setRunning(true);
    // Mostrar o comando e o estado de "Aguarde..." imediatamente
    setOutput((prev) => [
      ...prev,
      `[${ts}] ${promptLabel} ${effectiveCmd}`,
      "Aguarde...",
    ]);
    setCommand("");

    // Após 2s, exibir a saída simulada do terminal
    setTimeout(() => {
      let lines = [];
      if (typeof onRun === "function") {
        const res = onRun(effectiveCmd) || [];
        lines = lines.concat(Array.isArray(res) ? res : [String(res)]);
      } else {
        switch (effectiveCmd) {
          case "hello":
          case "print(\"Hello World\")":
            lines.push("Hello World");
            lines.push("Bem-vindo ao grupo Builders de Elite!");
            lines.push("use com moderação; fique atento às lives e à comunidade");
            break;
          default:
            lines.push(`[erro] comando desconhecido: ${effectiveCmd}`);
            lines.push("disponível: 'hello' — tente digitar 'hello'");
            break;
        }
      }
      setOutput((prev) => [...prev, ...lines]);
      setRunning(false);
    }, 2000);
  };

  const numberedCode = codeLines.map((line, idx) => `${String(idx + 1).padEnd(3, " ")}${line}`).join("\n");

  return (
    <>
      <div className="home__welcome">
        <h2 className="home__welcome-title">{title}</h2>
        <p className="home__welcome-text">{description}</p>
      </div>

      <div className="home__terminal" role="region" aria-label="Terminal">
        <div className="home__terminal-header">
          <div className="home__prompt">
            <span className="home__prompt-label">{promptLabel}</span>
            <input
              className="home__prompt-input"
              type="text"
              value={command}
              placeholder={inputPlaceholder}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") run();
              }}
              aria-label="Entrada de comando"
              disabled={running}
            />
          </div>
          <button
            className={`home__run-btn ${running ? "is-running" : ""}`}
            onClick={run}
            aria-label={runLabel}
            disabled={running}
            title={runLabel}
          >
            {running ? (
              <FaSpinner className="home__run-icon home__run-spinner" />
            ) : (
              <FaPlay className="home__run-icon" />
            )}
          </button>
        </div>

        <div className="home__terminal-body">
          <pre className="home__code" aria-label="Editor de código simulado">{numberedCode}</pre>
          <div className="home__output" aria-live="polite">
            {output.map((line, i) => (
              <div key={i} className="home__output-line">{line}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}