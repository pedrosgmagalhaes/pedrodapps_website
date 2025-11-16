import React from "react";
import "./Courses.css";
import checkIcon from "../assets/check.svg";

const courses = [
  {
    id: "conteudo-pratico",
    title: "Operação real, direta ao ponto",
    description:
      "Tudo o que você precisa para estruturar, automatizar e operar com cripto de forma clara e acessível.",
  },
  {
    id: "estrategia-mercado",
    title: "Estratégia de Mercado",
    description:
      "Baseado em experiências reais, com automações DeFi, criação de tokens e soluções de pagamentos.",
  },
  {
    id: "estruturacao-tecnica",
    title: "Estrutura técnica com mãos na massa",
    description: "Monte operação segura e autônoma, com foco em receita previsível e crescimento.",
  },
  {
    id: "personalizacao",
    title: "Personalização sob medida",
    description:
      "Desenvolvimento de soluções personalizadas, adaptadas às necessidades específicas do seu negócio.",
  },
  {
    id: "scripts-defi",
    title: "Scripts DeFi Prontos",
    description: "Coleção curada de automações e bots para operar com segurança e eficiência.",
  },
  {
    id: "beneficios-pixley",
    title: "Benefícios do Pixley Wallet",
    description:
      "Descubra os benefícios exclusivos do Pixley, como segurança, eficiência e suporte exclusivo.",
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
              <p className="course-card__description reveal-on-scroll is-visible">
                {item.description}
              </p>
              {Array.isArray(item.features) && item.features.length > 0 && (
                <ul className="course-card__features" aria-label={`Recursos do ${item.title}`}>
                  {item.features.map((feat, i) => (
                    <li key={i} className="course-card__feature-item">
                      {feat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
