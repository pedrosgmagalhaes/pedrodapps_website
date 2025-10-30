import React from "react";
import "./Courses.css";
import checkIcon from "../assets/check.svg";

const courses = [
  {
    id: "conteudo-pratico",
    title: "Conteúdo prático e direto",
    description:
      "Tudo o que você precisa para criar e operar sua corretora de forma clara e acessível.",
  },
  {
    id: "estrategia-mercado",
    title: "Estratégia de Mercado",
    description:
      "Baseado em experiências reais da Pixley, criadora de soluções como Crypto POS e Pix to Wire.",
  },
  {
    id: "estruturacao-tecnica",
    title: "Estruturação técnica com hands on",
    description:
      "Aprenda a montar o negócio com autonomia, segurança e foco em receita, colocando a mão na massa.",
  },
];

export default function Courses() {
  return (
    <section className="courses" id="cursos" aria-label="Cursos disponíveis">
      <div className="container">
        <div className="courses__header">
          <h2 className="courses__title">
            Treinamento, Cursos e<br />
            <span className="courses__title-highlight">Scripts Prontos</span>
          </h2>
        </div>
        <div className="courses__grid">
          {courses.map((item, index) => (
            <div
              className={`course-card reveal-on-scroll is-visible ${index === 0 ? "course-card--expanded" : ""}`}
              key={item.id}
              style={{ transitionDelay: `${index * 0.2}s` }}
            >


              <div className="course-card__header">
                <div className="course-card__icon-wrapper">
                  <img src={checkIcon} alt="" className="course-card__icon" />
                </div>
                <h3 className="course-card__title reveal-on-scroll is-visible">{item.title}</h3>
              </div>
              <p className="course-card__description reveal-on-scroll is-visible">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
