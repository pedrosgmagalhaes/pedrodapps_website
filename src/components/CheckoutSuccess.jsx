import React from "react";
import { useLocation, Link } from "react-router-dom";
import { collectContextParams } from "../lib/checkoutTelemetry";
import "./Checkout.css";
import checkIcon from "../assets/check_purple.svg";

export default function CheckoutSuccess() {
  const location = useLocation();
  const buildCheckoutUrl = () => {
    const base = new URLSearchParams({ course: "builders-de-elite", product: "plan-anual" });
    const src = new URLSearchParams(location.search);
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "ref",
      "origin",
      "gclid",
      "fbclid",
      "lang",
    ].forEach((k) => {
      const v = src.get(k);
      if (v) base.set(k, v);
    });
    const checkoutBase = (
      (import.meta?.env?.VITE_CHECKOUT_BASE_URL ??
        (typeof globalThis !== "undefined" &&
        typeof globalThis["__APP_CHECKOUT_BASE_URL__"] === "string"
          ? globalThis["__APP_CHECKOUT_BASE_URL__"]
          : "")) ||
      `${window.location.origin}/checkout`
    ).trim();
    const extra = collectContextParams();
    Object.entries(extra).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).length > 0) base.set(k, String(v));
    });
    return `${checkoutBase}?${base.toString()}`;
  };
  const params = new URLSearchParams(location.search);
  const paymentIntent =
    params.get("payment_intent") || params.get("payment_intent_client_secret") || null;
  const redirectStatus = params.get("redirect_status") || null;

  const statusText = (() => {
    if (redirectStatus === "succeeded") return "Pagamento confirmado";
    if (redirectStatus === "requires_action") return "Pagamento iniciado – conclua a autenticação";
    if (redirectStatus === "failed") return "Pagamento não confirmado";
    return "Status do pagamento";
  })();
  const isSuccess = redirectStatus === "succeeded";

  return (
    <section className="checkout" id="checkout-success" aria-labelledby="checkout-success-title">
      <div className="container checkout__container">
        <div
          className="checkout__card reveal-on-scroll is-visible"
          role="region"
          aria-describedby="checkout-success-desc"
        >
          <header className="checkout__header checkout__header--center">
            {isSuccess ? (
              <div className="checkout__status" aria-live="polite">
                <img src={checkIcon} alt="" aria-hidden="true" className="checkout__status-icon" />
                <h2 id="checkout-success-title" className="checkout__title">
                  Pagamento confirmado
                </h2>
              </div>
            ) : (
              <h2 id="checkout-success-title" className="checkout__title">
                {statusText}
              </h2>
            )}
            <p id="checkout-success-desc" className="checkout__subtitle">
              Obrigado! Sua matrícula será processada em instantes após confirmação do pagamento.
            </p>
          </header>

          <div className="checkout__summary">
            <div className="checkout__summary-row">
              <span>Pedido</span>
              <strong>{paymentIntent ? String(paymentIntent).slice(0, 18) + "…" : "N/A"}</strong>
            </div>
            <div className="checkout__summary-row">
              <span>Status</span>
              <strong>{redirectStatus || "verificando"}</strong>
            </div>
          </div>

          <div className="checkout__panel" style={{ display: "grid", gap: 12 }}>
            <Link
              to="/members/home"
              className="btn btn-primary checkout__btn"
              aria-label="Ir para Área de Membros"
            >
              Ir para Área de Membros
            </Link>
            <Link
              to={buildCheckoutUrl()}
              className="btn checkout__btn checkout__btn--secondary"
              aria-label="Voltar ao Checkout"
            >
              Voltar ao Checkout
            </Link>
          </div>

          <div className="checkout__footnote">
            <small>
              Ao continuar, você concorda com a{" "}
              <a href="/privacidade" aria-label="Abrir Política de Privacidade">
                Política de Privacidade
              </a>
              .
            </small>
            <small>
              {" "}
              Uso responsável de automação: teste em ambiente controlado, defina limites e monitore
              execuções. Leia os{" "}
              <a href="/servicos" aria-label="Abrir Termos de Serviço">
                Termos de Serviço
              </a>
              .
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}