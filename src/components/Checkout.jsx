import React, { useState } from "react";
import QRCode from "qrcode";
import "./Checkout.css";
import pedrodappsIcon from "../assets/pedrodapps_icon.png";
import pixIcon from "../assets/icons8-foto.svg";
import { FaBarcode, FaCreditCard } from "react-icons/fa";

export default function Checkout() {
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

  // Cartão
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState(""); // MM/AA
  const [cardCvv, setCardCvv] = useState("");

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

  const handleCardPay = async () => {
    if (!validateCommon()) return;
    if (cardNumber.replace(/\s/g, "").length < 13 || !cardName || !/^(0[1-9]|1[0-2])\/(\d{2})$/.test(cardExpiry) || cardCvv.length < 3) {
      setStatus("error");
      setMessage("Preencha dados do cartão corretamente.");
      return;
    }
    try {
      setStatus("loading");
      setMessage("");
      await new Promise((r) => setTimeout(r, 1200));
      setStatus("success");
      setMessage("Pagamento aprovado.");
    } catch {
      setStatus("error");
      setMessage("Erro ao processar cartão.");
    }
  };

  return (
    <section className="checkout" id="checkout" aria-labelledby="checkout-title">
      <div className="container checkout__container">
        <div className="checkout__brand">
          <img src={pedrodappsIcon} alt="Pedro dApps" className="checkout__brand-logo" />
        </div>

        <div className="checkout__card" role="form" aria-describedby="checkout-desc">
          <header className="checkout__header">
            <h2 id="checkout-title" className="checkout__title">Faça parte</h2>
            <p id="checkout-desc" className="checkout__subtitle">Escolha seu meio de pagamento abaixo.</p>
          </header>

          {status !== "idle" && message && (
            <div className={`checkout__alert ${status === "error" ? "checkout__alert--error" : "checkout__alert--success"}`} role="status" aria-live="polite">
              {message}
            </div>
          )}

          <div className="checkout__summary">
            <div className="checkout__summary-row">
              <span>Produto</span>
              <strong>Pedro dApps – Plano anual</strong>
            </div>
            <div className="checkout__summary-row">
              <span>Total</span>
              <strong>R$ 987,58</strong>
            </div>
          </div>

          <div className="checkout__methods" role="tablist" aria-label="Métodos de pagamento">
            <button type="button" className={`checkout__tab ${method === "pix" ? "is-active" : ""}`} onClick={() => setMethod("pix")} role="tab" aria-selected={method === "pix"}>
              <img src={pixIcon} className="checkout__tab-icon" alt="" aria-hidden="true" />
              <span>PIX</span>
            </button>
            <button type="button" className={`checkout__tab ${method === "boleto" ? "is-active" : ""}`} onClick={() => setMethod("boleto")} role="tab" aria-selected={method === "boleto"}>
              <FaBarcode className="checkout__tab-icon" aria-hidden="true" />
              <span>Boleto</span>
            </button>
            <button type="button" className={`checkout__tab ${method === "card" ? "is-active" : ""}`} onClick={() => setMethod("card")} role="tab" aria-selected={method === "card"}>
              <FaCreditCard className="checkout__tab-icon" aria-hidden="true" />
              <span>Cartão de crédito</span>
            </button>
          </div>

          <form className="checkout__form" onSubmit={(e) => e.preventDefault()}>
            <div className="checkout__field">
              <label htmlFor="buyer-name" className="checkout__label">Nome completo</label>
              <input id="buyer-name" className="checkout__input" type="text" placeholder="Seu nome" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
            </div>
            <div className="checkout__field">
              <label htmlFor="buyer-email" className="checkout__label">E-mail</label>
              <input id="buyer-email" className="checkout__input" type="email" placeholder="seu@email.com" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} />
            </div>

            {method === "pix" && (
              <div className="checkout__panel" aria-labelledby="pix-title">
                <h3 id="pix-title" className="checkout__panel-title">Pagamento via PIX</h3>
                {pixQr && (
                  <div className="checkout__pix-qr" aria-label="QR Code PIX">
                    <img src={pixQr} alt="QR Code PIX" className="checkout__pix-qr-img" />
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-primary checkout__btn"
                  onClick={async () => {
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
                    onClick={handlePixPay}
                  >
                    {status === "loading" ? "Iniciando..." : "Confirmar pagamento PIX"}
                  </button>
                )}
              </div>
            )}

            {method === "boleto" && (
              <div className="checkout__panel" aria-labelledby="boleto-title">
                <h3 id="boleto-title" className="checkout__panel-title">Gerar Boleto</h3>
                <div className="checkout__field">
                  <label htmlFor="buyer-doc" className="checkout__label">CPF/CNPJ</label>
                  <input id="buyer-doc" className="checkout__input" type="text" placeholder="Somente números" value={doc} onChange={(e) => setDoc(e.target.value.replace(/[^0-9]/g, ""))} />
                </div>
                <button type="button" className="btn btn-primary checkout__btn" disabled={status === "loading"} onClick={handleBoleto}>
                  {status === "loading" ? "Gerando..." : "Gerar boleto"}
                </button>
              </div>
            )}

            {method === "card" && (
              <div className="checkout__panel" aria-labelledby="card-title">
                <h3 id="card-title" className="checkout__panel-title">Pagar com Cartão</h3>
                <div className="checkout__grid">
                  <div className="checkout__field">
                    <label htmlFor="card-number" className="checkout__label">Número do cartão</label>
                    <input id="card-number" className="checkout__input" type="text" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                  </div>
                  <div className="checkout__field">
                    <label htmlFor="card-name" className="checkout__label">Nome impresso</label>
                    <input id="card-name" className="checkout__input" type="text" placeholder="Como no cartão" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                  </div>
                  <div className="checkout__field">
                    <label htmlFor="card-expiry" className="checkout__label">Validade (MM/AA)</label>
                    <input id="card-expiry" className="checkout__input" type="text" placeholder="MM/AA" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} />
                  </div>
                  <div className="checkout__field">
                    <label htmlFor="card-cvv" className="checkout__label">CVV</label>
                    <input id="card-cvv" className="checkout__input" type="password" placeholder="***" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ""))} />
                  </div>
                </div>
                <button type="button" className="btn btn-primary checkout__btn" disabled={status === "loading"} onClick={handleCardPay}>
                  {status === "loading" ? "Processando..." : "Pagar com cartão"}
                </button>
              </div>
            )}

            <div className="checkout__footnote">
              <small>
                Ao continuar, você concorda com a {" "}
                <a href="#privacidade" aria-label="Abrir Política de Privacidade">Política de Privacidade</a>.
              </small>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}