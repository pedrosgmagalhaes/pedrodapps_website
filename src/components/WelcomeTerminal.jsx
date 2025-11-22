import React from "react";
import Terminal from "./Terminal";

export default function WelcomeTerminal({
  title = "Bem-vindo ao grupo Builders de Elite",
  description = "Conteúdos exclusivos para usuários avançados, vídeo aulas, download de bots, suporte e outros conteúdos riquíssimos.",
  promptLabel = "builders-de-elite:~$",
  inputPlaceholder = "digite um comando (ex.: hello)",
  runLabel = "EXECUTAR",
  codeLines = [
    'print("Hello World")',
    'print("Bem-vindo ao grupo Builders de Elite!")',
    "",
    "def build_house():",
    "  pass",
    "def test_structure():",
    "  pass",
    "",
    "# TODO: adicione seus próprios testes aqui",
    'print("Simulando...")',
  ],
  onRun,
}) {
  const defaultCommands = {
    hello: () => [
      "Hello World",
      "Bem-vindo ao grupo Builders de Elite!",
      "use com moderação; fique atento às lives e à comunidade",
    ],
    'print("Hello World")': () => [
      "Hello World",
      "Bem-vindo ao grupo Builders de Elite!",
      "use com moderação; fique atento às lives e à comunidade",
    ],
  };

  return (
    <>
      <div className="home__welcome">
        <h2 className="home__welcome-title">{title}</h2>
        <p className="home__welcome-text">{description}</p>
      </div>

      <Terminal
        promptLabel={promptLabel}
        inputPlaceholder={inputPlaceholder}
        runLabel={runLabel}
        codeLines={codeLines}
        commands={defaultCommands}
        onRun={onRun}
      />
    </>
  );
}