import React, { useState, useEffect } from "react";
import "./VipArea.css";
import checkNavy from "../assets/check_navy.svg";
import cardsImg from "../assets/cards.svg";
import pixleyLogo from "../assets/pixley_logo_white.png";

const benefits = [
  "Acesso completo à plataforma exclusiva com scripts, treinamentos, insights, dicas e atualizações",
  "Plano Premium no Pixley com descontos, maiores limites operacionais, acesso a ferramentas avançadas.",
  "Acesso a grande quantidade de scripts DeFi, Hacks, Automações e ferramentas avançadas com DeFi.",
];

export default function VipArea() {
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Função para calcular o tempo restante
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

      // Calcula quantos ciclos de 7 dias se passaram desde uma data base
      const baseDate = new Date("2024-01-01").getTime();
      const timeSinceBase = now - baseDate;
      const cyclesPassed = Math.floor(timeSinceBase / sevenDaysInMs);
      const nextCycleStart = baseDate + (cyclesPassed + 1) * sevenDaysInMs;

      const difference = nextCycleStart - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    // Atualiza o cronômetro a cada segundo
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Calcula o tempo inicial
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="vip" id="vip" aria-label="Área VIP e oferta">
      <div className="container">
        <div className="vip__grid">
          {/* Coluna esquerda: benefícios */}
          <div className="vip__left">
            <h2 className="vip__title">
              Tenha acesso à<br />
              <span className="vip__title-highlight">Área VIP</span>
            </h2>
            <p className="vip__subtitle">
              O acesso à área VIP, com conteúdos de scripts, treinamento, cursos, e outras questões
            </p>
            <ul className="vip__list">
              {benefits.map((b, i) => (
                <li className="vip__item" key={i}>
                  <span className="vip__item-icon" aria-hidden="true">
                    <img src={checkNavy} alt="" />
                  </span>
                  <span className="vip__item-text">{b}</span>
                </li>
              ))}
            </ul>

            {/* Card adicional: Pixley Premium incluída, colocado logo após o item de scripts */}
            <div className="vip__pixley-card" role="region" aria-label="Pixley Premium incluída">
              <img src={pixleyLogo} alt="Pixley" className="vip__pixley-logo" />
              <div className="vip__pixley-content">
                <p className="vip__pixley-text">
                  Ao entrar, você ganha uma conta <strong>Premium</strong> na Pixley Wallet com benefícios
                  exclusivos:
                </p>
                <ul className="vip__pixley-benefits">
                  <li className="vip__pixley-benefit">
                    <span className="vip__item-icon" aria-hidden="true">
                      <img src={checkNavy} alt="" />
                    </span>
                    <span className="vip__pixley-benefit-text">Descontos nas tarifas e operações</span>
                  </li>
                  <li className="vip__pixley-benefit">
                    <span className="vip__item-icon" aria-hidden="true">
                      <img src={checkNavy} alt="" />
                    </span>
                    <span className="vip__pixley-benefit-text">Cashbacks em <strong>USDT</strong> em serviços selecionados</span>
                  </li>
                  <li className="vip__pixley-benefit">
                    <span className="vip__item-icon" aria-hidden="true">
                      <img src={checkNavy} alt="" />
                    </span>
                    <span className="vip__pixley-benefit-text">Atendimento exclusivo e prioritário</span>
                  </li>
                </ul>
                <div className="vip__pixley-footnote">
                  *Sujeito às regras de elegibilidade da Pixley.
                </div>
              </div>
            </div>
          </div>

          {/* Coluna direita: cartão de preço */}
          <div className="vip__right">
            <div className="vip-card" role="region" aria-label="Cartão de preço">
              <div className="vip-card__countdown">
                <div className="countdown-title">Oferta expira em:</div>
                <div className="countdown-timer">
                  <div className="countdown-item">
                    <span className="countdown-number">
                      {timeLeft.days.toString().padStart(2, "0")}
                    </span>
                    <span className="countdown-label">dias</span>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-item">
                    <span className="countdown-number">
                      {timeLeft.hours.toString().padStart(2, "0")}
                    </span>
                    <span className="countdown-label">horas</span>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-item">
                    <span className="countdown-number">
                      {timeLeft.minutes.toString().padStart(2, "0")}
                    </span>
                    <span className="countdown-label">min</span>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-item">
                    <span className="countdown-number">
                      {timeLeft.seconds.toString().padStart(2, "0")}
                    </span>
                    <span className="countdown-label">seg</span>
                  </div>
                </div>
              </div>
              <div className="vip-card__header">
                <span className="vip-card__old-price">De R$ 2.358,00</span>
              </div>
              <div className="vip-card__price">
                <span className="vip-card__currency">R$</span>
                <span className="vip-card__amount">487,58</span>
                <span className="vip-card__period">por ano</span>
              </div>
              <a href="#checkout" className="vip-card__cta" aria-label="Quero comprar agora">
                Quero comprar agora
              </a>
              <div className="vip-card__footnote">Pagamento seguro • Cartão</div>
              <img src={cardsImg} alt="Bandeiras de cartões" className="vip-card__cards" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
