import React, { useState, useEffect } from "react";
import "./VipArea.css";
import checkNavy from "../assets/check_navy.svg";
import cardsImg from "../assets/cards.svg";

const benefits = [
  "Acesso completo à plataforma exclusiva com scripts, treinamentos, insights, dicas e atualizações",
  "Plano anual (sem adesão contratual)",
  "Sem taxas ocultas — tudo transparente e acessível",
];

export default function VipArea() {
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Função para calcular o tempo restante
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      
      // Calcula quantos ciclos de 7 dias se passaram desde uma data base
      const baseDate = new Date('2024-01-01').getTime();
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
            <h2 className="vip__title">Tenha acesso à<br />
              <span className="vip__title-highlight">Área VIP</span>
            </h2>
            <p className="vip__subtitle">O acesso à área VIP, com conteúdos de scripts, treinamento, cursos, e outras questões</p>
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

            <p className="vip__guarantee">
              30 dias de garantia de satisfação
              <span className="vip__guarantee-detail">
                Se decidir não continuar, cancele dentro do período — sem complicações, sem cobranças extras.
              </span>
            </p>
          </div>

          {/* Coluna direita: cartão de preço */}
          <div className="vip__right">
            <div className="vip-card" role="region" aria-label="Cartão de preço">
              <div className="vip-card__countdown">
                <div className="countdown-title">Oferta expira em:</div>
                <div className="countdown-timer">
                  <div className="countdown-item">
                    <span className="countdown-number">{timeLeft.days.toString().padStart(2, '0')}</span>
                    <span className="countdown-label">dias</span>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-item">
                    <span className="countdown-number">{timeLeft.hours.toString().padStart(2, '0')}</span>
                    <span className="countdown-label">horas</span>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-item">
                    <span className="countdown-number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                    <span className="countdown-label">min</span>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-item">
                    <span className="countdown-number">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    <span className="countdown-label">seg</span>
                  </div>
                </div>
              </div>
              <div className="vip-card__header">
                <span className="vip-card__old-price">De R$ 1.258,00</span>
              </div>
              <div className="vip-card__price">
                <span className="vip-card__currency">R$</span>
                <span className="vip-card__amount">657,58</span>
                <span className="vip-card__period">por ano</span>
              </div>
              <a href="#comprar" className="vip-card__cta" aria-label="Quero comprar agora">
                Quero comprar agora
              </a>
              <div className="vip-card__footnote">
                Pagamento seguro • Cartão • Pix
              </div>
              <img src={cardsImg} alt="Bandeiras de cartões" className="vip-card__cards" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
