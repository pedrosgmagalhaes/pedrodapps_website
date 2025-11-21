import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import "./Checkout.css";
import { API } from "../lib/api";

export default function CheckoutReturn() {
  const location = useLocation();
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const q = new URLSearchParams(location.search);
        const sessionId = q.get("session_id");
        if (!sessionId) return;
        const data = await API.get(`/api/payments/session-status?session_id=${encodeURIComponent(sessionId)}`, { method: "GET", baseUrl: PAYMENTS_BASE });
        if (data) {
          setStatus(data.status || null);
          setCustomerEmail(data.customer_email || "");
        }
      } catch {
        // silencioso
      }
    })();
  }, [location.search]);

  if (status === "open") {
    return <Navigate to="/checkout" replace />;
  }

  if (status === "complete") {
    return (
      <section className="checkout" id="checkout-success" aria-labelledby="checkout-success-title">
        <div className="container checkout__container">
          <div className="checkout__card reveal-on-scroll is-visible" role="region" aria-describedby="checkout-success-desc">
            <header className="checkout__header checkout__header--center">
              <h2 id="checkout-success-title" className="checkout__title">Pagamento confirmado</h2>
            </header>
            <div className="checkout__panel-desc">
              <p>
                Obrigado pela sua compra! Um e-mail de confirmação foi enviado para {customerEmail}.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
}
const PAYMENTS_BASE = (
  (import.meta?.env?.VITE_PAYMENTS_BASE_URL ??
    (typeof globalThis !== "undefined" &&
    typeof globalThis["__APP_PAYMENTS_BASE_URL__"] === "string"
      ? globalThis["__APP_PAYMENTS_BASE_URL__"]
      : "")) ||
  "http://localhost:3002"
).trim();
