import React, { useState } from "react";
import QRCode from "qrcode";
import "./Checkout.css";
import pedrodappsIcon from "../assets/pedrodapps_icon.png";
import pixIcon from "../assets/icons8-foto.svg";
import pixleyImg from "../assets/pixley.png";
import usdtIcon from "../assets/icons/usdt.svg";
import usdcIcon from "../assets/icons/usdc.svg";
import btcIcon from "../assets/icons/btc-orange.svg";

import { FaBarcode, FaCreditCard, FaBitcoin } from "react-icons/fa";

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

  // Crypto
  const [cryptoCurrency, setCryptoCurrency] = useState("BTC"); // BTC | USDT | USDC
  const [cryptoAmount, setCryptoAmount] = useState(null); // numeric
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [cryptoQr, setCryptoQr] = useState("");

  const PRICE_BRL = 987.58; // valor em BRL para conversão

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
    if (
      cardNumber.replace(/\s/g, "").length < 13 ||
      !cardName ||
      !/^(0[1-9]|1[0-2])\/(\d{2})$/.test(cardExpiry) ||
      cardCvv.length < 3
    ) {
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

        <div className="checkout__card reveal-on-scroll" role="form" aria-describedby="checkout-desc">
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

          <div className="checkout__summary">
            <div className="checkout__summary-row">
              <span>Produto</span>
              <strong>Pedro dApps – Plano anual</strong>
            </div>
            <div className="checkout__summary-row">
              <span>Total</span>
              <strong>R$ 487,58</strong>
            </div>
          </div>

          <div className="checkout__methods" role="tablist" aria-label="Métodos de pagamento">
            <button
              type="button"
              className={`checkout__tab ${method === "pix" ? "is-active" : ""}`}
              onClick={() => setMethod("pix")}
              role="tab"
              aria-selected={method === "pix"}
            >
              <img src={pixIcon} className="checkout__tab-icon" alt="" aria-hidden="true" />
              <span>PIX</span>
            </button>
            <button
              type="button"
              className={`checkout__tab ${method === "boleto" ? "is-active" : ""}`}
              onClick={() => setMethod("boleto")}
              role="tab"
              aria-selected={method === "boleto"}
            >
              <FaBarcode className="checkout__tab-icon" aria-hidden="true" />
              <span>Boleto</span>
            </button>
            <button
              type="button"
              className={`checkout__tab ${method === "card" ? "is-active" : ""}`}
              onClick={() => setMethod("card")}
              role="tab"
              aria-selected={method === "card"}
            >
              <FaCreditCard className="checkout__tab-icon" aria-hidden="true" />
              <span>Cartão de crédito</span>
            </button>
            <button
              type="button"
              className={`checkout__tab ${method === "crypto" ? "is-active" : ""}`}
              onClick={() => setMethod("crypto")}
              role="tab"
              aria-selected={method === "crypto"}
            >
              <FaBitcoin className="checkout__tab-icon" aria-hidden="true" />
              <span>Criptomoedas</span>
            </button>
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

            {method === "pix" && (
              <div className="checkout__panel" aria-labelledby="pix-title">
                <h3 id="pix-title" className="checkout__panel-title">
                  Pagamento via PIX
                </h3>
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
                <h3 id="boleto-title" className="checkout__panel-title">
                  Gerar Boleto
                </h3>
                <div className="checkout__field">
                  <label htmlFor="buyer-doc" className="checkout__label">
                    CPF/CNPJ
                  </label>
                  <input
                    id="buyer-doc"
                    className="checkout__input"
                    type="text"
                    placeholder="Somente números"
                    value={doc}
                    onChange={(e) => setDoc(e.target.value.replace(/[^0-9]/g, ""))}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary checkout__btn"
                  disabled={status === "loading"}
                  onClick={handleBoleto}
                >
                  {status === "loading" ? "Gerando..." : "Gerar boleto"}
                </button>
              </div>
            )}

            {method === "card" && (
              <div className="checkout__panel" aria-labelledby="card-title">
                <h3 id="card-title" className="checkout__panel-title">
                  Pagar com Cartão
                </h3>
                <div className="checkout__grid">
                  <div className="checkout__field">
                    <label htmlFor="card-number" className="checkout__label">
                      Número do cartão
                    </label>
                    <input
                      id="card-number"
                      className="checkout__input"
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="checkout__field">
                    <label htmlFor="card-name" className="checkout__label">
                      Nome impresso
                    </label>
                    <input
                      id="card-name"
                      className="checkout__input"
                      type="text"
                      placeholder="Como no cartão"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <div className="checkout__field">
                    <label htmlFor="card-expiry" className="checkout__label">
                      Validade (MM/AA)
                    </label>
                    <input
                      id="card-expiry"
                      className="checkout__input"
                      type="text"
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>
                  <div className="checkout__field">
                    <label htmlFor="card-cvv" className="checkout__label">
                      CVV
                    </label>
                    <input
                      id="card-cvv"
                      className="checkout__input"
                      type="password"
                      placeholder="***"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ""))}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary checkout__btn"
                  disabled={status === "loading"}
                  onClick={handleCardPay}
                >
                  {status === "loading" ? "Processando..." : "Pagar com cartão"}
                </button>
              </div>
            )}

            {method === "crypto" && (
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
                  onClick={handleGenerateCryptoWallet}
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
                    onClick={handleCryptoConfirm}
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

        <div className="checkout__powered reveal-on-scroll">
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
