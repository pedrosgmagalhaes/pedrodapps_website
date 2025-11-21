import React from "react";
import "./ContactCTA.css";
import coins2Img from "../assets/icons2.png";
import { useLocation } from "react-router-dom";

export default function ContactCTA() {
  const location = useLocation();
  const buildCheckoutUrl = () => {
    const base = new URLSearchParams({ course: "builders-de-elite", product: "plan-anual" });
    const src = new URLSearchParams(location.search);
    ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","ref","origin","gclid","fbclid","lang"].forEach((k) => {
      const v = src.get(k);
      if (v) base.set(k, v);
    });
    const checkoutBase = (
      (import.meta?.env?.VITE_CHECKOUT_BASE_URL ??
        (typeof globalThis !== "undefined" && typeof globalThis["__APP_CHECKOUT_BASE_URL__"] === "string"
          ? globalThis["__APP_CHECKOUT_BASE_URL__"]
          : "")) || `${window.location.origin}/checkout`
    ).trim();
    return `${checkoutBase}?${base.toString()}`;
  };
  return (
    <section className="contact" id="duvidas">
      <div className="container contact__container">
        <div className="contact__content">
          <span className="contact__eyebrow">BUILDERS DE ELITE</span>
          <h2 className="contact__title">Pronto para começar? Faça parte do Builders de Elite</h2>
          <p className="contact__subtitle">
            Garanta seu acesso e junte-se ao Builders de Elite para começar agora.
          </p>

          <div className="contact__actions">
            <a href={buildCheckoutUrl()} className="hero__btn hero__btn--primary">
              Quero fazer parte
            </a>
          </div>
        </div>

        <div className="contact__coins-wrap" aria-hidden="true">
          <img className="contact__coins" src={coins2Img} alt="" />
        </div>
      </div>
    </section>
  );
}
