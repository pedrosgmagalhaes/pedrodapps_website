import React, { useState } from "react";
import { FaPlay, FaSpinner } from "react-icons/fa";
import { runPython, installPackages } from "../lib/pythonRunner";

export default function Terminal({
  promptLabel = "builders-de-elite:~$",
  inputPlaceholder = "digite um comando (ex.: hello)",
  runLabel = "EXECUTAR",
  codeLines = [],
  commands = {},
  onRun,
}) {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState([]);
  const [running, setRunning] = useState(false);

  const numberedCode = Array.isArray(codeLines)
    ? codeLines.map((line, idx) => `${String(idx + 1).padEnd(3, " ")}${line}`).join("\n")
    : "";

  const run = () => {
    if (running) return;
    const cmd = command.trim();
    const effectiveCmd = cmd || "hello";
    const ts = new Date().toLocaleTimeString();

    setRunning(true);
    setOutput((prev) => [...prev, `[${ts}] ${promptLabel} ${effectiveCmd}`, "Aguarde..."]);
    setCommand("");

    (async () => {
      let lines = [];
      try {
        if (typeof onRun === "function") {
          const res = onRun(effectiveCmd) || [];
          lines = lines.concat(Array.isArray(res) ? res : [String(res)]);
        } else {
          const handler = commands[effectiveCmd];
          if (typeof handler === "function") {
            const res = handler(effectiveCmd) || [];
            lines = lines.concat(Array.isArray(res) ? res : [String(res)]);
          } else {
            // If the command looks like Python, execute via Pyodide
            const isPython = /^(print\(|def\s+|#|for\s|while\s|import\s|from\s)/.test(effectiveCmd);
            if (isPython) {
              const result = await runPython(effectiveCmd, 5000);
              if (result.ok) {
                const out = String(result.stdout || "").trimEnd();
                lines = lines.concat(out ? out.split(/\n/) : ["(sem saída)"]);
              } else {
                lines = lines.concat([`[erro] ${result.error || "Falha ao executar Python"}`]);
              }
            } else {
              // Support "pip install <pkg>" via micropip
              const pipMatch = /^pip\s+install\s+([A-Za-z0-9_.-]+)(?:==([^\s]+))?/.exec(
                effectiveCmd
              );
              if (pipMatch) {
                const pkg = pipMatch[1];
                const ver = pipMatch[2];
                const spec = ver ? `${pkg}==${ver}` : pkg;
                const res = await installPackages([spec], 15000);
                if (res.ok) {
                  lines.push(res.message || `Instalado: ${spec}`);
                } else {
                  lines.push(`[erro] instalação falhou: ${res.error || "erro desconhecido"}`);
                }
              } else {
                switch (effectiveCmd) {
                  case "hello":
                  case 'print("Hello World")':
                    lines.push("Hello World");
                    lines.push("Bem-vindo ao grupo Builders de Elite!");
                    lines.push("use com moderação; fique atento às lives e à comunidade");
                    break;
                  default:
                    lines.push(`[erro] comando desconhecido: ${effectiveCmd}`);
                    lines.push(
                      `disponível: 'hello' — tente digitar 'hello' ou 'print("Hello World")'`
                    );
                    break;
                }
              }
            }
          }
        }
      } catch (err) {
        lines = lines.concat([`[erro] ${String(err?.message || err)}`]);
      }
      setOutput((prev) => [...prev, ...lines]);
      setRunning(false);
    })();
  };

  return (
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
        <div className="home__run-actions">
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
          {/* Remove the second button */}
        </div>
      </div>

      <div className="home__terminal-body">
        <pre className="home__code" aria-label="Editor de código simulado" aria-live="polite">
          {numberedCode}
          {output.length ? "\n" : ""}
          {output.map((line, i) => (
            <span key={i} className="home__output-line">
              {line}
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}
