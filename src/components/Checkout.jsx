import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import "./Checkout.css";
import pedrodappsIcon from "../assets/pedrodapps_icon.png";
import pixIcon from "../assets/icons8-foto.svg";
import pixleyImg from "../assets/pixley.png";
import usdtIcon from "../assets/icons/usdt.svg";
import usdcIcon from "../assets/icons/usdc.svg";
import btcIcon from "../assets/icons/btc-orange.svg";

import { FaBarcode, FaCreditCard, FaBitcoin } from "react-icons/fa";
import stripeWordmark from "../assets/stripe_wordmark.svg";
import { useLocation } from "react-router-dom";
import { API } from "../lib/api";
import { emitCheckoutEvent } from "../lib/checkoutTelemetry";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Catálogo de produtos e formatação

export default function Checkout() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const productParam = query.get("product") || "plan-anual";
  const courseSlug = query.get("course") || "builders-de-elite";
  const [ctx, setCtx] = useState(null);
  const [ctxLoading, setCtxLoading] = useState(true);
  const approvedMethods = ctx?.payments?.approvedMethods || ["pix", "card"]; // fallback padrão
  const supportsMethod = (name) => {
    const list = approvedMethods || [];
    return list.includes(name) || (name === 'card' && list.includes('stripe'));
  };
  const STRIPE_PK = ((import.meta?.env?.VITE_STRIPE_PUBLIC_KEY ?? (
    typeof globalThis !== 'undefined' && typeof globalThis['__APP_VITE_STRIPE_PUBLIC_KEY__'] === 'string'
      ? globalThis['__APP_VITE_STRIPE_PUBLIC_KEY__']
      : ""
  )) || "").trim();
  const stripePromise = STRIPE_PK ? loadStripe(STRIPE_PK) : null;
  const utm = {
    utm_source: query.get("utm_source") || null,
    utm_medium: query.get("utm_medium") || null,
    utm_campaign: query.get("utm_campaign") || null,
    utm_content: query.get("utm_content") || null,
    utm_term: query.get("utm_term") || null,
    ref: query.get("ref") || null,
    origin: query.get("origin") || null,
    gclid: query.get("gclid") || null,
    fbclid: query.get("fbclid") || null,
  };

  const [method, setMethod] = useState("pix"); // pix | boleto | card
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  // Campos comuns
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");

  // PIX
  const pixKey = "pix@pedrodapps.com"; // placeholder de chave
  const [pixQr, setPixQr] = useState("");

  // Boleto
  const [doc, setDoc] = useState(""); // CPF/CNPJ (simplificado)
  const formatCpfCnpj = (digits) => {
    const d = String(digits || "").replace(/\D/g, "");
    if (d.length <= 11) {
      const p1 = d.slice(0, 3);
      const p2 = d.slice(3, 6);
      const p3 = d.slice(6, 9);
      const p4 = d.slice(9, 11);
      let out = "";
      if (p1) out = p1;
      if (p2) out += `.${p2}`;
      if (p3) out += `.${p3}`;
      if (p4) out += `-${p4}`;
      return out;
    }
    // CNPJ
    const p1 = d.slice(0, 2);
    const p2 = d.slice(2, 5);
    const p3 = d.slice(5, 8);
    const p4 = d.slice(8, 12);
    const p5 = d.slice(12, 14);
    let out = "";
    if (p1) out = p1;
    if (p2) out += `.${p2}`;
    if (p3) out += `.${p3}`;
    if (p4) out += `/${p4}`;
    if (p5) out += `-${p5}`;
    return out;
  };

  // Cartão (Stripe Elements substitui inputs locais)

  // Crypto
  const [cryptoCurrency, setCryptoCurrency] = useState("BTC"); // BTC | USDT | USDC
  const [cryptoAmount, setCryptoAmount] = useState(null); // numeric
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [cryptoQr, setCryptoQr] = useState("");
  // Stripe
  const [clientSecret, setClientSecret] = useState("");
  const requestClientSecret = async () => {
    try {
      setStatus('loading');
      setMessage('Preparando pagamento com cartão...');
      const trimmedEmail = (buyerEmail || '').trim();
      const payload = {
        preferredLanguage: (utm.lang || (typeof navigator !== 'undefined' ? navigator.language : 'pt')),
        receiptEmail: trimmedEmail && /[^\s@]+@[^\s@]+\.[^\s@]+/.test(trimmedEmail) ? trimmedEmail : undefined,
      };
      const res = await API.courses.checkoutStripe(courseSlug, payload);
      if (res && res.clientSecret) {
        setClientSecret(res.clientSecret);
        setStatus('idle');
        setMessage('');
      } else if (res && res.error) {
        // Tratamento explícito de indisponibilidade no ambiente (ex.: 404)
        setStatus('error');
        setMessage(res.status === 404
          ? 'Cartão indisponível neste ambiente. Use PIX ou tente novamente mais tarde.'
          : 'Não foi possível iniciar o pagamento com cartão.');
        // Se houver PIX aprovado, alterna automaticamente para PIX como fallback
        if (supportsMethod('pix')) {
          setMethod('pix');
        }
      } else {
        setStatus('error');
        setMessage('Não foi possível iniciar o pagamento com cartão.');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err?.message || 'Falha ao obter autorização de pagamento.');
      // Fallback para PIX quando disponível
      if (supportsMethod('pix')) {
        setMethod('pix');
      }
    }
  };
  const PRICE_BRL = ctx?.product?.totalCents
    ? (ctx.product.totalCents / 100)
    : (ctx?.course?.priceCents ? (ctx.course.priceCents / 100) : null);

  // Persistir metadados de checkout para análises e integração com backend
  useEffect(() => {
    (async () => {
      setCtxLoading(true);
      try {
        // Monta os query params a partir da URL atual para o backend
        const qp = Object.fromEntries(Array.from(query.entries()));
        const res = await API.courses.checkoutContext(courseSlug, qp);
        if (!res?.error) {
          setCtx(res);
          // Ajusta método inicial com base em recomendação + métodos aprovados
          const recommended = res?.payments?.recommended;
          const approved = Array.isArray(res?.payments?.approvedMethods) ? res.payments.approvedMethods : [];
          let nextMethod = method;
          if (approved.length > 0) {
            if (recommended && approved.includes(recommended)) {
              nextMethod = recommended === 'stripe' ? 'card' : recommended; // normaliza 'stripe' → 'card' na UI
            } else {
              const first = approved[0];
              nextMethod = first === 'stripe' ? 'card' : first;
            }
          }
          setMethod(nextMethod);
        }
      } catch {
        // mantém fallback local
      }
      // Persistência de metadados (merge do contexto quando presente)
      try {
        const meta = {
          product: productParam,
          product_name: (ctx?.product?.name || ctx?.course?.title || null),
          product_price_brl: PRICE_BRL,
          course: courseSlug,
          marketing: ctx?.marketing || utm,
          path: location.pathname,
          referrer: typeof document !== "undefined" ? document.referrer || null : null,
          environment: ctx?.environment || null,
          visitor: ctx?.visitor || null,
          ts: Date.now(),
        };
        localStorage.setItem("checkout_meta", JSON.stringify(meta));
        // Telemetry: pageview
        await emitCheckoutEvent({ courseSlug, eventType: 'pageview', metadata: meta });
      } catch {
        // Ignora falhas de acesso
      }
      setCtxLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Buscar clientSecret quando método "card" estiver ativo
  useEffect(() => {
    (async () => {
      if (method !== 'card') return;
      if (!supportsMethod('card')) return;
      await requestClientSecret();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, buyerEmail, courseSlug]);

  const fetchOkxTicker = async (instId) => {
    const url = `https://www.okx.com/api/v5/market/ticker?instId=${encodeURIComponent(instId)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data || data.code !== "0" || !data.data || !data.data[0])
      throw new Error("Ticker indisponível");
    return Number(data.data[0].last);
  };

  const getBrlPriceFor = async (symbol) => {
    // Tenta pares diretos em BRL, senão compõe via USDT
    if (symbol === "BTC") {
      try {
        return await fetchOkxTicker("BTC-BRL");
      } catch {
        const btcUsdt = await fetchOkxTicker("BTC-USDT");
        const usdtBrl = await fetchOkxTicker("USDT-BRL");
        return btcUsdt * usdtBrl;
      }
    }
    if (symbol === "USDT") {
      try {
        return await fetchOkxTicker("USDT-BRL");
      } catch {
        return null;
      }
    }
    if (symbol === "USDC") {
      try {
        return await fetchOkxTicker("USDC-BRL");
      } catch {
        return null;
      }
    }
    return null;
  };

  const handleGenerateCryptoWallet = async () => {
    if (!validateCommon()) return;
    try {
      setStatus("loading");
      setMessage("");
      const priceBRL = await getBrlPriceFor(cryptoCurrency);
      if (!priceBRL || !isFinite(priceBRL) || priceBRL <= 0) {
        throw new Error("Cotação indisponível no momento. Tente novamente.");
      }
      const amount = PRICE_BRL / priceBRL;
      setCryptoAmount(amount);

      // Endereços de demonstração (substituir por geração real de carteira)
      const demoAddresses = {
        BTC: "bc1qexampleaddress0000000000000000000",
        USDT: "0x1111111111111111111111111111111111111111",
        USDC: "0x2222222222222222222222222222222222222222",
      };
      const addr = demoAddresses[cryptoCurrency];
      setCryptoAddress(addr);

      // Construir payload para QR
      let qrPayload = addr;
      if (cryptoCurrency === "BTC") {
        const amtStr = amount.toFixed(8);
        qrPayload = `bitcoin:${addr}?amount=${amtStr}`;
      }
      const dataUrl = await QRCode.toDataURL(qrPayload, { width: 256, margin: 1 });
      setCryptoQr(dataUrl);
      setStatus("success");
      setMessage(`Carteira gerada. Envie exatamente ${amount.toFixed(6)} ${cryptoCurrency}.`);
    } catch (err) {
      setStatus("error");
      setMessage(err?.message || "Erro ao gerar carteira.");
    }
  };

  const handleCryptoConfirm = async () => {
    if (!validateCommon()) return;
    if (!cryptoAddress || !cryptoAmount) {
      setStatus('error');
      setMessage('Gere a carteira e o QR Code antes de confirmar o pagamento.');
      return;
    }
    try {
      setStatus('loading');
      setMessage('');
      await new Promise((r) => setTimeout(r, 1200));
      setStatus('success');
      setMessage('Pagamento em análise na blockchain. Vamos confirmar assim que a transação for detectada.');
    } catch {
      setStatus('error');
      setMessage('Erro ao verificar pagamento. Tente novamente.');
    }
  };

  const isValidEmail = (value) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);

  const validateCommon = () => {
    if (!buyerName || !isValidEmail(buyerEmail)) {
      setStatus("error");
      setMessage("Preencha nome e um e-mail válido.");
      return false;
    }
    return true;
  };

  const handlePixPay = async () => {
    if (!validateCommon()) return;
    if (!doc || doc.length < 11) {
      setStatus("error");
      setMessage("Informe um CPF/CNPJ válido.");
      return;
    }
    if (!pixQr) {
      setStatus("error");
      setMessage("Gere o QR Code antes de confirmar o pagamento.");
      return;
    }
    try {
      setStatus("loading");
      setMessage("");
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
      setMessage("Pagamento via PIX iniciado. Escaneie o QR para concluir.");
    } catch {
      setStatus("error");
      setMessage("Erro ao iniciar pagamento PIX.");
    }
  };

  const handleBoleto = async () => {
    if (!validateCommon()) return;
    if (!doc || doc.length < 11) {
      setStatus("error");
      setMessage("Informe um CPF/CNPJ válido.");
      return;
    }
    try {
      setStatus("loading");
      setMessage("");
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
      setMessage("Boleto gerado. Enviado para seu e-mail.");
    } catch {
      setStatus("error");
      setMessage("Erro ao gerar boleto.");
    }
  };

  return (
    <section className="checkout" id="checkout" aria-labelledby="checkout-title">
      <div className="container checkout__container">
        <div className="checkout__brand">
          <img src={pedrodappsIcon} alt="Pedro dApps" className="checkout__brand-logo" />
        </div>

        <div className="checkout__card reveal-on-scroll is-visible" role="form" aria-describedby="checkout-desc">
          <header className="checkout__header">
            <h2 id="checkout-title" className="checkout__title">
              Faça parte
            </h2>
            <p id="checkout-desc" className="checkout__subtitle">
              Escolha seu meio de pagamento abaixo.
            </p>
          </header>

          {status !== "idle" && message && (
            <div
              className={`checkout__alert ${status === "error" ? "checkout__alert--error" : "checkout__alert--success"}`}
              role="status"
              aria-live="polite"
            >
              {message}
            </div>
          )}

          <div className="checkout__summary reveal-on-scroll is-visible" style={{ position: 'relative', minHeight: 96 }}>
            {ctxLoading && (
              <div className="checkout__spinner" role="status" aria-live="polite" aria-label="Carregando contexto">
                <div className="checkout__spinner-circle" />
              </div>
            )}
            <div className="checkout__summary-row">
              <span>Produto</span>
              <strong>{ctx?.product?.name || ctx?.course?.title || "—"}</strong>
            </div>
            <div className="checkout__summary-row">
              <span>Total</span>
              <strong>{ctx?.product?.displayTotal || (ctx?.course?.currency && PRICE_BRL !== null ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: ctx.course.currency }).format(PRICE_BRL) : "—")}</strong>
          </div>
        </div>

          <div className="checkout__methods reveal-on-scroll is-visible" role="tablist" aria-label="Métodos de pagamento" style={{ position: 'relative', minHeight: 54 }}>
            {ctxLoading && (
              <div className="checkout__spinner" role="status" aria-live="polite" aria-label="Carregando métodos">
                <div className="checkout__spinner-circle" />
              </div>
            )}
            {supportsMethod('pix') && (
            <button
              type="button"
              className={`checkout__tab ${method === "pix" ? "is-active" : ""}`}
              disabled={ctxLoading}
              aria-disabled={ctxLoading}
              onClick={async () => {
                setMethod("pix");
                await emitCheckoutEvent({ courseSlug, eventType: 'method_change', paymentMethod: 'pix', ctaId: 'tab-pix', metadata: { component: 'methods' } });
              }}
              role="tab"
              aria-selected={method === "pix"}
            >
              <img src={pixIcon} className="checkout__tab-icon" alt="" aria-hidden="true" />
              <span>PIX</span>
            </button>
            )}
            {supportsMethod('boleto') && (
            <button
              type="button"
              className={`checkout__tab ${method === "boleto" ? "is-active" : ""}`}
              disabled={ctxLoading}
              aria-disabled={ctxLoading}
              onClick={async () => {
                setMethod("boleto");
                await emitCheckoutEvent({ courseSlug, eventType: 'method_change', paymentMethod: undefined, ctaId: 'tab-boleto', metadata: { component: 'methods' } });
              }}
              role="tab"
              aria-selected={method === "boleto"}
            >
              <FaBarcode className="checkout__tab-icon" aria-hidden="true" />
              <span>Boleto</span>
            </button>
            )}
            {supportsMethod('card') && (
            <button
              type="button"
              className={`checkout__tab ${method === "card" ? "is-active" : ""}`}
              disabled={ctxLoading}
              aria-disabled={ctxLoading}
              onClick={async () => {
                setMethod("card");
                await emitCheckoutEvent({ courseSlug, eventType: 'method_change', paymentMethod: 'stripe', ctaId: 'tab-card', metadata: { component: 'methods' } });
              }}
              role="tab"
              aria-selected={method === "card"}
            >
              <FaCreditCard className="checkout__tab-icon" aria-hidden="true" />
              <span>Cartão de crédito</span>
            </button>
            )}
            {supportsMethod('crypto') && (
            <button
              type="button"
              className={`checkout__tab ${method === "crypto" ? "is-active" : ""}`}
              disabled={ctxLoading}
              aria-disabled={ctxLoading}
              onClick={async () => {
                setMethod("crypto");
                await emitCheckoutEvent({ courseSlug, eventType: 'method_change', paymentMethod: undefined, ctaId: 'tab-crypto', metadata: { component: 'methods' } });
              }}
              role="tab"
              aria-selected={method === "crypto"}
            >
              <FaBitcoin className="checkout__tab-icon" aria-hidden="true" />
              <span>Criptomoedas</span>
            </button>
            )}
          </div>

          <form className="checkout__form" onSubmit={(e) => e.preventDefault()}>
            <div className="checkout__field">
              <label htmlFor="buyer-name" className="checkout__label">
                Nome completo
              </label>
              <input
                id="buyer-name"
                className="checkout__input"
                type="text"
                placeholder="Seu nome"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
              />
            </div>
            <div className="checkout__field">
              <label htmlFor="buyer-email" className="checkout__label">
                E-mail
              </label>
              <input
                id="buyer-email"
                className="checkout__input"
                type="email"
                placeholder="seu@email.com"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
              />
            </div>

            {approvedMethods.includes('pix') && method === "pix" && (
              <div className="checkout__panel" aria-labelledby="pix-title">
                <h3 id="pix-title" className="checkout__panel-title">
                  Pagamento via PIX
                </h3>
                <div className="checkout__field">
                  <label htmlFor="pix-doc" className="checkout__label">CPF/CNPJ</label>
                  <input
                    id="pix-doc"
                    className="checkout__input"
                    type="text"
                    placeholder="CPF ou CNPJ"
                    value={formatCpfCnpj(doc)}
                    onChange={(e) => setDoc(e.target.value.replace(/[^0-9]/g, ""))}
                    inputMode="numeric"
                    autoComplete="off"
                    pattern="\d*"
                  />
                </div>
                {pixQr && (
                  <div className="checkout__pix-qr" aria-label="QR Code PIX">
                    <img src={pixQr} alt="QR Code PIX" className="checkout__pix-qr-img" />
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-primary checkout__btn"
                  onClick={async () => {
                    // Exige CPF/CNPJ válido antes de gerar QR
                    if (!doc || doc.length < 11) {
                      setStatus("error");
                      setMessage("Informe um CPF/CNPJ válido.");
                      return;
                    }
                    await emitCheckoutEvent({ courseSlug, eventType: 'cta_click', ctaId: 'pix-generate-qr', metadata: { component: 'pix' } });
                    try {
                      setStatus("loading");
                      setMessage("");
                      const dataUrl = await QRCode.toDataURL(pixKey, { width: 256, margin: 1 });
                      setPixQr(dataUrl);
                      setStatus("success");
                      setMessage("QR Code gerado. Escaneie com seu app do banco.");
                    } catch {
                      setStatus("error");
                      setMessage("Não foi possível gerar o QR Code de PIX.");
                    }
                  }}
                >
                  {status === "loading" ? "Gerando..." : "Gerar QR Code"}
                </button>
                {pixQr && (
                  <button
                    type="button"
                    className="btn checkout__btn checkout__btn--secondary"
                    disabled={status === "loading"}
                    onClick={async () => {
                      await emitCheckoutEvent({ courseSlug, eventType: 'cta_click', ctaId: 'pix-confirm', metadata: { component: 'pix' } });
                      await emitCheckoutEvent({ courseSlug, eventType: 'purchase_start', paymentMethod: 'pix', metadata: { component: 'pix' } });
                      await handlePixPay();
                      await emitCheckoutEvent({ courseSlug, eventType: 'purchase_confirm', paymentMethod: 'pix', metadata: { component: 'pix' } });
                    }}
                  >
                    {status === "loading" ? "Iniciando..." : "Confirmar pagamento PIX"}
                  </button>
                )}
              </div>
            )}

            {approvedMethods.includes('boleto') && method === "boleto" && (
              <div className="checkout__panel" aria-labelledby="boleto-title">
                <h3 id="boleto-title" className="checkout__panel-title">
                  Gerar Boleto
                </h3>
                <div className="checkout__field">
                  <label htmlFor="buyer-doc" className="checkout__label">CPF/CNPJ</label>
                  <input
                    id="buyer-doc"
                    className="checkout__input"
                    type="text"
                    placeholder="CPF ou CNPJ"
                    value={formatCpfCnpj(doc)}
                    onChange={(e) => setDoc(e.target.value.replace(/[^0-9]/g, ""))}
                    inputMode="numeric"
                    autoComplete="off"
                    pattern="\d*"
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary checkout__btn"
                  disabled={status === "loading"}
                  onClick={async () => {
                    await emitCheckoutEvent({ courseSlug, eventType: 'cta_click', ctaId: 'boleto-generate', metadata: { component: 'boleto' } });
                    await emitCheckoutEvent({ courseSlug, eventType: 'purchase_start', metadata: { component: 'boleto' } });
                    await handleBoleto();
                    await emitCheckoutEvent({ courseSlug, eventType: 'purchase_confirm', metadata: { component: 'boleto' } });
                  }}
                >
                  {status === "loading" ? "Gerando..." : "Gerar boleto"}
                </button>
              </div>
            )}

            {supportsMethod('card') && method === "card" && (
              <div className="checkout__panel" aria-labelledby="card-title">
                <h3 id="card-title" className="checkout__panel-title">Cartão de crédito (Stripe)</h3>
                <div className="checkout__stripe" aria-label="Processado pela Stripe">
                  <span className="checkout__stripe-powered">Processado por</span>
                  <span className="checkout__stripe-badge">
                    <span className="checkout__stripe-wordmark">
                      <img src={stripeWordmark} alt="Stripe" className="checkout__stripe-logo" />
                    </span>
                  </span>
                </div>
                {stripePromise ? (
                  clientSecret ? (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        locale: (utm.lang || 'auto'),
                        // Prioriza cartão e evita exibir Boleto na UI do PaymentElement
                        paymentMethodOrder: ['card'],
                        appearance: {
                          theme: 'night',
                          variables: {
                            colorPrimary: '#635BFF',
                            colorBackground: '#1c1e2f',
                            colorText: '#ffffff',
                            colorTextSecondary: 'rgba(255,255,255,0.8)',
                            colorIcon: '#c7c9d1',
                            borderRadius: '8px',
                            fontFamily:
                              'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, sans-serif',
                            spacingUnit: '4px',
                          },
                          rules: {
                            '.Input, .Textarea, .Select': {
                              backgroundColor: '#1c1e2f',
                              border: '1px solid rgba(255,255,255,0.16)',
                              color: '#ffffff',
                            },
                            '.Input:hover': { borderColor: '#635BFF' },
                            '.Label': { color: 'rgba(255,255,255,0.85)' },
                            '.Tab': { color: '#ffffff' },
                            '.Block': { backgroundColor: 'transparent' },
                          },
                        },
                      }}
                    >
                      <StripePaymentForm
                        courseSlug={courseSlug}
                        onTelemetry={emitCheckoutEvent}
                        setStatus={setStatus}
                        setMessage={setMessage}
                      />
                    </Elements>
                  ) : (
                    <div className="checkout__panel-desc" role="status" aria-live="polite" style={{ position: 'relative', minHeight: 96 }}>
                      {status === 'loading' ? (
                        <div className="checkout__spinner" aria-label="Preparando pagamento">
                          <div className="checkout__spinner-circle" />
                        </div>
                      ) : (
                        <span>{message || 'Iniciando pagamento com cartão...'}</span>
                      )}
                      {status === 'error' && (
                        <div style={{ marginTop: 12 }}>
                          <button type="button" className="btn checkout__btn checkout__btn--secondary" onClick={requestClientSecret}>
                            Tentar novamente
                          </button>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div className="checkout__panel-desc">Stripe não configurado. Defina VITE_STRIPE_PUBLIC_KEY para habilitar.</div>
                )}
              </div>
            )}

            {approvedMethods.includes('crypto') && method === "crypto" && (
              <div className="checkout__panel" aria-labelledby="crypto-title">
                <h3 id="crypto-title" className="checkout__panel-title">
                  Pagar com Criptomoedas
                </h3>
                <p className="checkout__panel-desc">
                  Escolha a moeda e gere o QR Code com o valor convertido a partir de R${" "}
                  {PRICE_BRL.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.
                </p>
                <div
                  className="checkout__crypto-controls"
                  role="group"
                  aria-label="Escolher cripto"
                >
                  <button
                    type="button"
                    className={`checkout__tab ${cryptoCurrency === "BTC" ? "is-active" : ""}`}
                    onClick={() => setCryptoCurrency("BTC")}
                  >
                    <img src={btcIcon} className="checkout__tab-icon" alt="" aria-hidden="true" />{" "}
                    BTC
                  </button>
                  <button
                    type="button"
                    className={`checkout__tab ${cryptoCurrency === "USDT" ? "is-active" : ""}`}
                    onClick={() => setCryptoCurrency("USDT")}
                  >
                    <img src={usdtIcon} className="checkout__tab-icon" alt="" aria-hidden="true" />{" "}
                    USDT
                  </button>
                  <button
                    type="button"
                    className={`checkout__tab ${cryptoCurrency === "USDC" ? "is-active" : ""}`}
                    onClick={() => setCryptoCurrency("USDC")}
                  >
                    <img src={usdcIcon} className="checkout__tab-icon" alt="" aria-hidden="true" />{" "}
                    USDC
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-primary checkout__btn"
                  disabled={status === "loading"}
                  onClick={async () => {
                    await emitCheckoutEvent({ courseSlug, eventType: 'cta_click', ctaId: 'crypto-generate', metadata: { component: 'crypto', currency: cryptoCurrency } });
                    await handleGenerateCryptoWallet();
                  }}
                >
                  {status === "loading" ? "Gerando..." : "Gerar carteira"}
                </button>
                {cryptoQr && (
                  <div className="checkout__crypto-qr" aria-label="QR Code Cripto">
                    <img
                      src={cryptoQr}
                      alt={`QR ${cryptoCurrency}`}
                      className="checkout__pix-qr-img"
                    />
                  </div>
                )}
                {cryptoAmount && (
                  <div className="checkout__crypto-amount">
                    <strong>Valor:</strong> {cryptoAmount.toFixed(6)} {cryptoCurrency}
                  </div>
                )}
                {cryptoAddress && (
                  <div className="checkout__crypto-address">
                    <span>Endereço:</span>
                    <code>{cryptoAddress}</code>
                  </div>
                )}
                {cryptoQr && (
                  <button
                    type="button"
                    className="btn checkout__btn checkout__btn--secondary"
                    disabled={status === 'loading'}
                    onClick={async () => {
                      await emitCheckoutEvent({ courseSlug, eventType: 'cta_click', ctaId: 'crypto-confirm', metadata: { component: 'crypto', currency: cryptoCurrency } });
                      await emitCheckoutEvent({ courseSlug, eventType: 'purchase_confirm', metadata: { component: 'crypto', currency: cryptoCurrency } });
                      await handleCryptoConfirm();
                    }}
                  >
                    {status === 'loading' ? 'Verificando...' : 'Realizei o pagamento'}
                  </button>
                )}
              </div>
            )}

            <div className="checkout__footnote">
              <small>
                Ao continuar, você concorda com a{" "}
                <a href="/privacidade" aria-label="Abrir Política de Privacidade">
                  {" "}
                  Política de Privacidade.
                </a>
              </small>
              <small>{" "}
                Uso responsável de automação: teste em ambiente controlado, defina limites e
                monitore execuções. Leia os{" "}
                <a href="/servicos" aria-label="Abrir Termos de Serviço">
                  Termos de Serviço
                </a>
                .
              </small>
            </div>
          </form>
        </div>

        <div className="checkout__powered reveal-on-scroll is-visible">
          <span className="checkout__powered-text">Checkout by</span>
          <a
            href="https://pixley.app"
            target="_blank"
            rel="noopener noreferrer"
            className="checkout__powered-link"
            aria-label="Abrir site da Pixley"
          >
            <img src={pixleyImg} alt="Pixley" className="checkout__powered-logo" />
          </a>
        </div>
      </div>
    </section>
  );
}

function StripePaymentForm({ courseSlug, onTelemetry, setStatus, setMessage }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isReady, setIsReady] = useState(false);
  const handlePay = async () => {
    if (!stripe || !elements) return;
    await onTelemetry({ courseSlug, eventType: 'cta_click', ctaId: 'card-pay', metadata: { component: 'card' } });
    await onTelemetry({ courseSlug, eventType: 'purchase_start', paymentMethod: 'stripe', metadata: { component: 'card' } });
    try {
      setStatus('loading'); setMessage('');
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/checkout/success` },
      });
      if (error) {
        setStatus('error');
        setMessage(error.message || 'Erro ao confirmar pagamento.');
        return;
      }
      if (paymentIntent?.status === 'succeeded') {
        setStatus('success');
        setMessage('Pagamento confirmado. Matrícula será processada.');
        await onTelemetry({ courseSlug, eventType: 'purchase_confirm', paymentMethod: 'stripe', metadata: { component: 'card' } });
      } else {
        setStatus('success');
        setMessage('Pagamento iniciado. Se necessário, complete a autenticação.');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err?.message || 'Erro ao processar cartão.');
    }
  };
  return (
    <div>
      <div className="checkout__field">
        <label className="checkout__label">Dados do pagamento</label>
        <div className="checkout__input" style={{ padding: "12px", position: 'relative', minHeight: '250px' }} aria-busy={!isReady}>
          {!isReady && (
            <div className="checkout__spinner" role="status" aria-live="polite" aria-label="Carregando pagamento">
              <div className="checkout__spinner-circle" />
            </div>
          )}
          <PaymentElement onReady={() => setIsReady(true)} />
        </div>
      </div>
      <div className="checkout__stripe-actions">
        <button type="button" className="btn checkout__btn checkout__stripe-btn" onClick={handlePay}>
          Processar pagamento
        </button>
      </div>
    </div>
  );
}
