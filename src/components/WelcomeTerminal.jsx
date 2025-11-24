import React from "react";
import Terminal from "./Terminal";

export default function WelcomeTerminal({
  title = "Builders de Elite",
  description = "O Builders de Elite é um programa voltado para criadores Web3 com o objetivo de gerar receita por meio de cripto de forma independente, com liberdade e empreendedorismo. Aqui você acessa conteúdos práticos, ferramentas avançadas e comunidade para acelerar sua jornada.",
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
      <div className="home__welcome" style={{ marginTop: 14 }}>
        <p className="home__welcome-text">
          O curso é organizado em módulos com vídeos gravados, espaço para perguntas na comunidade,
          arquivos e downloads dos bots, além de aulas ao vivo para aprofundar os conteúdos e tirar
          dúvidas em tempo real.
        </p>
      </div>
    </>
  );
}
