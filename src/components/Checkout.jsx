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
import { useLocation } from "react-router-dom";
import { API } from "../lib/api";
import { emitCheckoutEvent } from "../lib/checkoutTelemetry";
// Stripe Payment Link

// Catálogo de produtos e formatação

export default function Checkout() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const productParam = query.get("product") || "plan-anual";
  const courseSlug = query.get("course") || "builders-de-elite";
  const [ctx, setCtx] = useState(null);
  const [ctxLoading, setCtxLoading] = useState(true);
  const approvedMethods = ctx?.payments?.approvedMethods || ["pix", "boleto", "card"]; // fallback inclui boleto
  const supportsMethod = (name) => {
    const list = approvedMethods || [];
    return list.includes(name) || (name === "card" && list.includes("stripe"));
  };
  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/eVq3cu3bx5nYdpn0e983C0b";
  const utm = React.useMemo(() => {
    const q = new URLSearchParams(location.search);
    return {
      utm_source: q.get("utm_source") || null,
      utm_medium: q.get("utm_medium") || null,
      utm_campaign: q.get("utm_campaign") || null,
      utm_content: q.get("utm_content") || null,
      utm_term: q.get("utm_term") || null,
      ref: q.get("ref") || null,
      origin: q.get("origin") || null,
      gclid: q.get("gclid") || null,
      fbclid: q.get("fbclid") || null,
    };
  }, [location.search]);

  const [method, setMethod] = useState("pix"); // pix | boleto | card
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  // Campos comuns
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");

  // PIX
  const [pixQr, setPixQr] = useState("");
  const [pixPayload, setPixPayload] = useState("");

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

  const [cep, setCep] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [addressStreet, setAddressStreet] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [addressComplement, setAddressComplement] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const formatCep = (digits) => {
    const d = String(digits || "").replace(/\D/g, "");
    const p1 = d.slice(0, 5);
    const p2 = d.slice(5, 8);
    return p2 ? `${p1}-${p2}` : p1;
  };
  const [boletoLinhaDigitavel, setBoletoLinhaDigitavel] = useState("");
  const [boletoPixCopiaECola, setBoletoPixCopiaECola] = useState("");
  useEffect(() => {
    const d = cep.replace(/\D/g, "");
    if (d.length === 8) {
      (async () => {
        try {
          setCepLoading(true);
          const res = await fetch(`https://viacep.com.br/ws/${encodeURIComponent(d)}/json/`);
          const data = await res.json();
          if (!data?.erro) {
            setAddressStreet(data?.logradouro || "");
            setAddressCity(data?.localidade || "");
            setAddressState(data?.uf || "");
          }
        } catch {
          void 0;
        } finally {
          setCepLoading(false);
        }
      })();
    }
  }, [cep]);

  // Cartão (Stripe Elements substitui inputs locais)

  // Crypto
  const [cryptoCurrency, setCryptoCurrency] = useState("BTC"); // BTC | USDT | USDC
  const [cryptoAmount, setCryptoAmount] = useState(null); // numeric
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [cryptoQr, setCryptoQr] = useState("");
  // Stripe Embedded Checkout

  const PRICE_BRL = ctx?.product?.totalCents
    ? ctx.product.totalCents / 100
    : ctx?.course?.priceCents
      ? ctx.course.priceCents / 100
      : null;

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
          const approved = Array.isArray(res?.payments?.approvedMethods)
            ? res.payments.approvedMethods
            : [];
          let nextMethod = method;
          if (approved.length > 0) {
            if (recommended && approved.includes(recommended)) {
              nextMethod = recommended === "stripe" ? "card" : recommended; // normaliza 'stripe' → 'card' na UI
            } else {
              const first = approved[0];
              nextMethod = first === "stripe" ? "card" : first;
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
          product_name: ctx?.product?.name || ctx?.course?.title || null,
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
        await emitCheckoutEvent({ courseSlug, eventType: "pageview", metadata: meta });
      } catch {
        // Ignora falhas de acesso
      }
      setCtxLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Método card usa Embedded Checkout; sem pré-fetch local

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
      setStatus("error");
      setMessage("Gere a carteira e o QR Code antes de confirmar o pagamento.");
      return;
    }
    try {
      setStatus("loading");
      setMessage("");
      await new Promise((r) => setTimeout(r, 1200));
      setStatus("success");
      setMessage(
        "Pagamento em análise na blockchain. Vamos confirmar assim que a transação for detectada."
      );
    } catch {
      setStatus("error");
      setMessage("Erro ao verificar pagamento. Tente novamente.");
    }
  };

  const isValidEmail = (value) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
  const emailReady = isValidEmail(buyerEmail);
  const nameReady = emailReady && buyerName.trim().length > 0;

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
    if (cep.replace(/\D/g, "").length !== 8) {
      setStatus("error");
      setMessage("Informe um CEP válido.");
      return;
    }
    if (
      !addressStreet.trim() ||
      !addressNumber.trim() ||
      !addressCity.trim() ||
      !addressState.trim()
    ) {
      setStatus("error");
      setMessage("Preencha endereço, número, cidade e estado.");
      return;
    }
    try {
      setStatus("loading");
      setMessage("");
      const linkSlug =
        ctx?.payments?.pixley?.linkSlug ||
        ctx?.payments?.pixleyLinkSlug ||
        ctx?.pixley?.linkSlug ||
        ctx?.pixleyLinkSlug ||
        null;
      if (!linkSlug) throw new Error("missing_link_slug");
      const payload = {
        linkSlug,
        payer: {
          name: buyerName,
          document: String(doc || "").replace(/\D/g, ""),
          email: buyerEmail,
          address: {
            street: addressStreet,
            number: addressNumber,
            complement: addressComplement,
            neighborhood: "",
            city: addressCity,
            state: addressState,
            zipCode: formatCep(cep),
          },
        },
        externalId: `boleto-${Date.now()}`,
        description: "Boleto via Payment Link",
      };
      if (ctx?.payments?.pixley?.allowCustomAmount === true && PRICE_BRL) {
        payload.amount = Number(PRICE_BRL);
      }
      const data = await API.courses.pixleyBoleto(courseSlug, payload);
      if (data?.error) throw new Error("request_failed");
      if (data?.linhaDigitavel) setBoletoLinhaDigitavel(String(data.linhaDigitavel));
      if (data?.pixCopiaECola) setBoletoPixCopiaECola(String(data.pixCopiaECola));
      void data?.id;
      setStatus("success");
      setMessage("Boleto gerado. Utilize a linha digitável para pagar.");
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

        <div
          className="checkout__card reveal-on-scroll is-visible"
          role="form"
          aria-describedby="checkout-desc"
        >
          <header className="checkout__header">
            <h2 id="checkout-title" className="checkout__title">
              Finalize seu pedido
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

          <div
            className="checkout__summary reveal-on-scroll is-visible"
            style={{ position: "relative", minHeight: 96 }}
          >
            {ctxLoading && (
              <div
                className="checkout__spinner"
                role="status"
                aria-live="polite"
                aria-label="Carregando contexto"
              >
                <div className="checkout__spinner-circle" />
              </div>
            )}
            <div className="checkout__summary-row">
              <span>Produto</span>
              <strong>{ctx?.product?.name || ctx?.course?.title || "—"}</strong>
            </div>
            <div className="checkout__summary-row">
              <span>Total</span>
              <strong>
                {ctx?.product?.displayTotal ||
                  (ctx?.course?.currency && PRICE_BRL !== null
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: ctx.course.currency,
                      }).format(PRICE_BRL)
                    : "—")}
              </strong>
            </div>
          </div>

          <div
            className="checkout__methods reveal-on-scroll is-visible"
            role="tablist"
            aria-label="Métodos de pagamento"
            style={{ position: "relative", minHeight: 54 }}
          >
            {ctxLoading && (
              <div
                className="checkout__spinner"
                role="status"
                aria-live="polite"
                aria-label="Carregando métodos"
              >
                <div className="checkout__spinner-circle" />
              </div>
            )}
            {supportsMethod("pix") && (
              <button
                type="button"
                className={`checkout__tab ${method === "pix" ? "is-active" : ""}`}
                disabled={ctxLoading}
                aria-disabled={ctxLoading}
                onClick={async () => {
                  setMethod("pix");
                  await emitCheckoutEvent({
                    courseSlug,
                    eventType: "method_change",
                    paymentMethod: "pix",
                    ctaId: "tab-pix",
                    metadata: { component: "methods" },
                  });
                }}
                role="tab"
                aria-selected={method === "pix"}
              >
                <img src={pixIcon} className="checkout__tab-icon" alt="" aria-hidden="true" />
                <span>PIX</span>
              </button>
            )}
            {supportsMethod("boleto") && (
              <button
                type="button"
                className={`checkout__tab ${method === "boleto" ? "is-active" : ""}`}
                disabled={ctxLoading}
                aria-disabled={ctxLoading}
                onClick={async () => {
                  setMethod("boleto");
                  await emitCheckoutEvent({
                    courseSlug,
                    eventType: "method_change",
                    paymentMethod: undefined,
                    ctaId: "tab-boleto",
                    metadata: { component: "methods" },
                  });
                }}
                role="tab"
                aria-selected={method === "boleto"}
              >
                <FaBarcode className="checkout__tab-icon" aria-hidden="true" />
                <span>Boleto</span>
              </button>
            )}
            {supportsMethod("card") && (
              <button
                type="button"
                className={`checkout__tab ${method === "card" ? "is-active" : ""}`}
                disabled={ctxLoading}
                aria-disabled={ctxLoading}
                onClick={async () => {
                  setMethod("card");
                  await emitCheckoutEvent({
                    courseSlug,
                    eventType: "method_change",
                    paymentMethod: "stripe",
                    ctaId: "tab-card",
                    metadata: { component: "methods" },
                  });
                }}
                role="tab"
                aria-selected={method === "card"}
                aria-label="Cartão de Crédito"
              >
                <FaCreditCard className="checkout__tab-icon" aria-hidden="true" />
                <span>Cartão de Crédito</span>
              </button>
            )}
            {supportsMethod("crypto") && (
              <button
                type="button"
                className={`checkout__tab ${method === "crypto" ? "is-active" : ""}`}
                disabled={ctxLoading}
                aria-disabled={ctxLoading}
                onClick={async () => {
                  setMethod("crypto");
                  await emitCheckoutEvent({
                    courseSlug,
                    eventType: "method_change",
                    paymentMethod: undefined,
                    ctaId: "tab-crypto",
                    metadata: { component: "methods" },
                  });
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
            {method !== "card" && (
              <>
                <div className={`checkout__field fade-in`}>
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
                {emailReady && (
                  <div className={`checkout__field fade-in`}>
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
                )}
              </>
            )}

            {approvedMethods.includes("pix") && method === "pix" && (
              <div className="checkout__panel" aria-labelledby="pix-title">
                <h3 id="pix-title" className="checkout__panel-title">
                  Pagamento via PIX
                </h3>
                {nameReady && (
                  <div className={`checkout__field fade-in`}>
                    <label htmlFor="pix-doc" className="checkout__label">
                      CPF/CNPJ
                    </label>
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
                )}
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
                    await emitCheckoutEvent({
                      courseSlug,
                      eventType: "cta_click",
                      ctaId: "pix-generate-qr",
                      metadata: { component: "pix" },
                    });
                    try {
                      setStatus("loading");
                      setMessage("");
                      const linkSlug =
                        ctx?.payments?.pixley?.linkSlug ||
                        ctx?.payments?.pixleyLinkSlug ||
                        ctx?.pixley?.linkSlug ||
                        ctx?.pixleyLinkSlug ||
                        null;
                      if (!linkSlug) throw new Error("missing_link_slug");
                      const payload = {
                        linkSlug,
                        payer: {
                          name: buyerName,
                          document: String(doc || "").replace(/\D/g, ""),
                          email: buyerEmail,
                        },
                        externalId: `pix-session-${Date.now()}`,
                      };
                      if (ctx?.payments?.pixley?.allowCustomAmount === true && PRICE_BRL) {
                        payload.amount = Number(PRICE_BRL);
                      }
                      const data = await API.courses.pixleyQr(courseSlug, payload);
                      if (data?.error) throw new Error("request_failed");
                      if (data?.qrCode && String(data.qrCode).startsWith("data:image")) {
                        setPixQr(data.qrCode);
                      } else if (data?.qrCodeData) {
                        setPixPayload(String(data.qrCodeData));
                        const img = await QRCode.toDataURL(String(data.qrCodeData));
                        setPixQr(img);
                      } else {
                        throw new Error("invalid_response");
                      }
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
                {pixPayload && (
                  <div className="checkout__field" aria-label="PIX Copia e Cola">
                    <label className="checkout__label">PIX Copia e Cola</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        className="checkout__input"
                        type="text"
                        readOnly
                        value={pixPayload}
                        onFocus={(e) => e.currentTarget.select()}
                      />
                      <button
                        type="button"
                        className="btn checkout__btn checkout__btn--secondary"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(pixPayload);
                            setMessage("PIX Copia e Cola copiado.");
                          } catch {
                            void 0;
                          }
                        }}
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                )}
                {pixQr && (
                  <button
                    type="button"
                    className="btn checkout__btn checkout__btn--secondary"
                    disabled={status === "loading"}
                    onClick={async () => {
                      await emitCheckoutEvent({
                        courseSlug,
                        eventType: "cta_click",
                        ctaId: "pix-confirm",
                        metadata: { component: "pix" },
                      });
                      await emitCheckoutEvent({
                        courseSlug,
                        eventType: "purchase_start",
                        paymentMethod: "pix",
                        metadata: { component: "pix" },
                      });
                      await handlePixPay();
                      await emitCheckoutEvent({
                        courseSlug,
                        eventType: "purchase_confirm",
                        paymentMethod: "pix",
                        metadata: { component: "pix" },
                      });
                    }}
                  >
                    {status === "loading" ? "Iniciando..." : "Confirmar pagamento PIX"}
                  </button>
                )}
              </div>
            )}

            {approvedMethods.includes("boleto") && method === "boleto" && (
              <div className="checkout__panel" aria-labelledby="boleto-title">
                <h3 id="boleto-title" className="checkout__panel-title">
                  Gerar Boleto
                </h3>
                {nameReady && (
                  <div className={`checkout__field fade-in`}>
                    <label htmlFor="buyer-doc" className="checkout__label">
                      CPF/CNPJ
                    </label>
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
                )}
                {nameReady && doc.replace(/\D/g, "").length >= 11 && (
                  <div className={`checkout__field fade-in`}>
                    <label htmlFor="buyer-cep" className="checkout__label">
                      CEP
                    </label>
                    <input
                      id="buyer-cep"
                      className="checkout__input"
                      type="text"
                      placeholder="00000-000"
                      value={formatCep(cep)}
                      onChange={(e) => setCep(e.target.value.replace(/[^0-9]/g, ""))}
                      inputMode="numeric"
                      autoComplete="postal-code"
                      pattern="\d*"
                      aria-busy={cepLoading}
                    />
                    {cepLoading && (
                      <div
                        className="checkout__spinner-circle"
                        aria-hidden="true"
                        style={{ display: "inline-block", marginLeft: 8 }}
                      />
                    )}
                  </div>
                )}
                {cep.replace(/\D/g, "").length === 8 && (
                  <>
                    <div className={`checkout__field fade-in`}>
                      <label htmlFor="buyer-street" className="checkout__label">
                        Endereço
                      </label>
                      <input
                        id="buyer-street"
                        className="checkout__input"
                        type="text"
                        placeholder="Rua/Av."
                        value={addressStreet}
                        onChange={(e) => setAddressStreet(e.target.value)}
                        disabled={cepLoading}
                      />
                    </div>
                    <div className={`checkout__grid`}>
                      <div className={`checkout__field fade-in`}>
                        <label htmlFor="buyer-number" className="checkout__label">
                          Número
                        </label>
                        <input
                          id="buyer-number"
                          className="checkout__input"
                          type="text"
                          placeholder="Número"
                          value={addressNumber}
                          onChange={(e) => setAddressNumber(e.target.value)}
                          inputMode="numeric"
                          disabled={cepLoading}
                        />
                      </div>
                      <div className={`checkout__field fade-in`}>
                        <label htmlFor="buyer-complement" className="checkout__label">
                          Complemento
                        </label>
                        <input
                          id="buyer-complement"
                          className="checkout__input"
                          type="text"
                          placeholder="Apto, bloco, referência"
                          value={addressComplement}
                          onChange={(e) => setAddressComplement(e.target.value)}
                          disabled={cepLoading}
                        />
                      </div>
                    </div>
                    <div className={`checkout__grid`}>
                      <div className={`checkout__field fade-in`}>
                        <label htmlFor="buyer-city" className="checkout__label">
                          Cidade
                        </label>
                        <input
                          id="buyer-city"
                          className="checkout__input"
                          type="text"
                          placeholder="Cidade"
                          value={addressCity}
                          onChange={(e) => setAddressCity(e.target.value)}
                          disabled={cepLoading}
                        />
                      </div>
                      <div className={`checkout__field fade-in`}>
                        <label htmlFor="buyer-state" className="checkout__label">
                          Estado
                        </label>
                        <input
                          id="buyer-state"
                          className="checkout__input"
                          type="text"
                          placeholder="UF"
                          value={addressState}
                          onChange={(e) => setAddressState(e.target.value.toUpperCase())}
                          maxLength={2}
                          disabled={cepLoading}
                        />
                      </div>
                    </div>
                  </>
                )}
                <button
                  type="button"
                  className="btn btn-primary checkout__btn"
                  disabled={status === "loading"}
                  onClick={async () => {
                    await emitCheckoutEvent({
                      courseSlug,
                      eventType: "cta_click",
                      ctaId: "boleto-generate",
                      metadata: { component: "boleto" },
                    });
                    await emitCheckoutEvent({
                      courseSlug,
                      eventType: "purchase_start",
                      metadata: { component: "boleto" },
                    });
                    await handleBoleto();
                    await emitCheckoutEvent({
                      courseSlug,
                      eventType: "purchase_confirm",
                      metadata: { component: "boleto" },
                    });
                  }}
                >
                  {status === "loading" ? "Gerando..." : "Gerar boleto"}
                </button>
                {(boletoLinhaDigitavel || boletoPixCopiaECola) && (
                  <div className="checkout__panel" aria-label="Dados do Boleto">
                    {boletoLinhaDigitavel && (
                      <div className="checkout__field">
                        <label className="checkout__label">Linha Digitável</label>
                        <input
                          className="checkout__input"
                          type="text"
                          readOnly
                          value={boletoLinhaDigitavel}
                          onFocus={(e) => e.currentTarget.select()}
                        />
                      </div>
                    )}
                    {boletoPixCopiaECola && (
                      <div className="checkout__field">
                        <label className="checkout__label">PIX Copia e Cola</label>
                        <input
                          className="checkout__input"
                          type="text"
                          readOnly
                          value={boletoPixCopiaECola}
                          onFocus={(e) => e.currentTarget.select()}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {supportsMethod("card") && method === "card" && (
              <div className="checkout__panel" aria-labelledby="card-title">
                <p className="checkout__panel-desc">
                  Você será redirecionado para a página de pagamento segura da Stripe para concluir
                  a transação.
                </p>
                <div className="checkout__stripe-actions">
                  <a
                    href={STRIPE_PAYMENT_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn checkout__btn checkout__stripe-btn"
                    onClick={async () => {
                      await emitCheckoutEvent({
                        courseSlug,
                        eventType: "cta_click",
                        paymentMethod: "stripe",
                        ctaId: "stripe-link",
                        metadata: { component: "card" },
                      });
                      await emitCheckoutEvent({
                        courseSlug,
                        eventType: "purchase_start",
                        paymentMethod: "stripe",
                        metadata: { component: "card" },
                      });
                    }}
                    aria-label="Checkout com Stripe"
                    title="Checkout com Stripe"
                  >
                    <span className="stripe-btn__text">Checkout com Stripe</span>
                  </a>
                </div>
              </div>
            )}

            {approvedMethods.includes("crypto") && method === "crypto" && (
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
                    await emitCheckoutEvent({
                      courseSlug,
                      eventType: "cta_click",
                      ctaId: "crypto-generate",
                      metadata: { component: "crypto", currency: cryptoCurrency },
                    });
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
                    disabled={status === "loading"}
                    onClick={async () => {
                      await emitCheckoutEvent({
                        courseSlug,
                        eventType: "cta_click",
                        ctaId: "crypto-confirm",
                        metadata: { component: "crypto", currency: cryptoCurrency },
                      });
                      await emitCheckoutEvent({
                        courseSlug,
                        eventType: "purchase_confirm",
                        metadata: { component: "crypto", currency: cryptoCurrency },
                      });
                      await handleCryptoConfirm();
                    }}
                  >
                    {status === "loading" ? "Verificando..." : "Realizei o pagamento"}
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
              <small>
                {" "}
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

// Embedded Checkout substitui o PaymentElement para cartão
