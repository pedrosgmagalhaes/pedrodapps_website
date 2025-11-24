import React from "react";
import ViewportSection from "./ViewportSection";
import "./Links.css";
import pedrodappsIcon from "../assets/pedrodapps_icon.png";
import buildersImg from "../assets/builders.png";
import pedroLogo from "../assets/pedro_dapps_logo.png";
import pixleyLogoViolet from "../assets/pixley_logo_icon_violet.svg";
import pixleyLogoWhite from "../assets/pixley_logo_violet.png";
import appleIcon from "../assets/apple.svg";
import playstoreIcon from "../assets/playstore.svg";
  import { FaYoutube, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
  import { SiX } from "react-icons/si";
import { useLocation } from "react-router-dom";
import { collectContextParams } from "../lib/checkoutTelemetry";

export default function Links() {
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
  const buildWhatsAppUrl = () => {
    const ctx = collectContextParams();
    const lines = [];
    lines.push("Olá");
    const entry = ctx.entry_url || ctx.referrer || "meu acesso atual";
    const device = ctx.device || "dispositivo";
    lines.push(
      `Estou entrando em contato através de ${entry}, utilizando dispositivo ${device} para ter mais informações.`
    );
    const utmPairs = [
      ctx.utm_source ? `utm_source=${ctx.utm_source}` : null,
      ctx.utm_medium ? `utm_medium=${ctx.utm_medium}` : null,
      ctx.utm_campaign ? `utm_campaign=${ctx.utm_campaign}` : null,
      ctx.utm_content ? `utm_content=${ctx.utm_content}` : null,
      ctx.utm_term ? `utm_term=${ctx.utm_term}` : null,
    ].filter(Boolean);
    if (utmPairs.length) {
      lines.push(`Origem de campanha: ${utmPairs.join(", ")}`);
    }
    const text = lines.join("\n");
    return `https://wa.me/13215100204?text=${encodeURIComponent(text)}`;
  };
  return (
    <section className="links" aria-label="Links rápidos">
      <div className="links__container">
        {/* Destaque do Programa Builders de Elite no topo */}
        <ViewportSection>
          <div className="links__highlight" role="region" aria-label="Programa Builders de Elite">
            <img
              src={buildersImg}
              alt="Builders de Elite"
              className="links__highlight-hero"
              loading="eager"
              decoding="async"
            />
            <div className="links__highlight-content">
              <span className="links__highlight-eyebrow">Programa</span>
              <h2 className="links__highlight-title">BUILDERS DE ELITE</h2>
              <p className="links__highlight-subtitle">
                Torne-se um programador avançado, livre das amarras — dominando scripts poderosos,
                tutoriais diretos ao ponto e uma comunidade que vive a liberdade tecnológica. Entre,
                evolua e construa sua própria independência.
              </p>
              <div className="links__highlight-actions">
                <a
                  href="https://pedrodapps.com/"
                  className="links__highlight-btn"
                  aria-label="Conhecer o Programa Builders de Elite"
                >
                  Conheça o programa
                </a>
                <a
                  href={buildCheckoutUrl()}
                  className="links__highlight-btn links__highlight-btn--secondary"
                  aria-label="Entrar agora no Builders de Elite"
                >
                  Entrar agora
                </a>

                <a
                  className="links__item"
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir conversa direta no WhatsApp"
                >
                  <FaWhatsapp className="links__icon" aria-hidden="true" />
                  <div className="links__label">
                    <span className="links__label-title">Contato direto no WhatsApp</span>
                    <span className="links__label-sub">+1 (321) 510-0204</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </ViewportSection>

        <ViewportSection>
          <div className="links__card" role="navigation" aria-label="Lista de links">
            <div className="links__header">
              <img
                src={pedroLogo}
                alt="Pedro dApps"
                className="links__avatar"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="links__section" aria-label="Links Pedro dApps">
              <div className="links__list">
                <a
                  className="links__item"
                  href="https://pedrodapps.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir site oficial pedrodapps.com em nova aba"
                >
                  <img
                    src={pedrodappsIcon}
                    alt="Pedro dApps"
                    className="links__icon"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="links__label">
                    <span className="links__label-super">Pedro dApps</span>
                    <span className="links__label-title">Site oficial</span>
                    <span className="links__label-sub">
                      Scripts, automações e tutoriais avançados para operações financeiras.
                    </span>
                  </div>
                </a>
                <a
                  className="links__item"
                  href="https://chat.whatsapp.com/Io83KeSGCqyByd0jP5l3RX"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Entrar no Grupo VIP Pedro dApps no WhatsApp (Grátis) em nova aba"
                >
                  <FaWhatsapp className="links__icon" aria-hidden="true" />
                  <div className="links__label">
                    <span className="links__label-title">Grupo VIP Pedro dApps (Grátis)</span>
                    <span className="links__label-sub">
                      chat.whatsapp.com/Io83KeSGCqyByd0jP5l3RX
                    </span>
                  </div>
                </a>

                <a
                  className="links__item"
                  href="https://www.youtube.com/@pedro_dapps"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir YouTube Pedro dApps em nova aba"
                >
                  <FaYoutube className="links__icon" aria-hidden="true" />
                  <div className="links__label">
                    <span className="links__label-title">Pedro dApps no YouTube</span>
                    <span className="links__label-sub">youtube.com/@pedro_dapps</span>
                  </div>
                </a>

                <a
                  className="links__item"
                  href="https://www.linkedin.com/in/pemagalhaes"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir LinkedIn Pedro Magalhães em nova aba"
                >
                  <FaLinkedinIn className="links__icon" aria-hidden="true" />
                  <div className="links__label">
                    <span className="links__label-title">Pedro dApps no LinkedIn</span>
                    <span className="links__label-sub">linkedin.com/in/pemagalhaes</span>
                  </div>
                </a>

                <a
                  className="links__item"
                  href="https://www.instagram.com/pedro_dapps/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir Instagram Pedro dApps em nova aba"
                >
                  <FaInstagram className="links__icon" aria-hidden="true" />
                  <div className="links__label">
                    <span className="links__label-title">Pedro dApps no Instagram</span>
                    <span className="links__label-sub">instagram.com/pedro_dapps</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </ViewportSection>

        {/* Card isolado: Pixely Wallet */}
        <ViewportSection>
          <div className="links__card links__card--pixely" role="region" aria-label="Pixely Wallet">
            <div className="links__section" aria-label="Links Pixely Wallet">
              {/* Bloco de marca Pixely separado com logo branca (antes do título) */}
              <div className="links__brand" role="img" aria-label="Marca Pixely Wallet">
                <img
                  src={pixleyLogoWhite}
                  alt="Pixely Wallet"
                  className="links__brand-logo"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="links__list">
                <a
                  className="links__item"
                  href="https://pixley.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir site oficial da Pixely Wallet em nova aba"
                >
                  <img
                    src={pixleyLogoViolet}
                    alt="Pixely Wallet"
                    className="links__icon"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="links__label">
                    <span className="links__label-super">Pixely Wallet</span>
                    <span className="links__label-title">Site oficial</span>
                    <span className="links__label-sub">Carteira cripto descentralizada</span>
                  </div>
                </a>

                {/* Botões de lojas como itens adicionais empilhados */}
                <a
                  className="links__item"
                  href="https://play.google.com/store/apps/details?id=com.pixley.wallet&pcampaignid=web_share&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download Pixely Wallet na Google Play em nova aba"
                >
                  <img
                    src={playstoreIcon}
                    alt="Google Play"
                    className="links__icon"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="links__label">
                    <span className="links__label-title">Download no Google Play</span>
                    <span className="links__label-sub">Disponível para Android</span>
                  </div>
                </a>

                <a
                  className="links__item"
                  href="https://apps.apple.com/br/app/pixley/id6754353921"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download Pixely Wallet na App Store em nova aba"
                >
                  <img
                    src={appleIcon}
                    alt="App Store"
                    className="links__icon"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="links__label">
                    <span className="links__label-title">Download na App Store</span>
                    <span className="links__label-sub">Disponível para iOS</span>
                  </div>
                </a>

                <a
                  className="links__item"
                  href="https://www.instagram.com/pixley_app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir Instagram Pixely Wallet em nova aba"
                >
                  <FaInstagram className="links__icon" aria-hidden="true" />
                  <div className="links__label">
                    <span className="links__label-title">Pixely no Instagram</span>
                    <span className="links__label-sub">instagram.com/pixley_app</span>
                  </div>
                </a>

                <a
                  className="links__item"
                  href="https://x.com/pixley_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir X (Twitter) Pixely Wallet em nova aba"
                >
                  <SiX className="links__icon" aria-hidden="true" />
                  <div className="links__label">
                    <span className="links__label-title">Pixely no X</span>
                    <span className="links__label-sub">x.com/pixley_app</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </ViewportSection>
        <div className="links__footer" role="contentinfo">
          <p className="links__footer-text">
            Esta página constitui <strong>ambiente externo</strong>, não pertencente nem operado por
            <strong> Meta Platforms, Inc. (Facebook/Instagram)</strong> ou{" "}
            <strong>YouTube/Google</strong>. Ao clicar nos links disponibilizados, você será
            redirecionado para <strong>websites de terceiros</strong>,
            <strong> fora do aplicativo</strong>. <strong>Não nos responsabilizamos</strong> pelo
            conteúdo, pelas práticas de privacidade ou pela segurança desses domínios externos.{" "}
            <strong>Ao prosseguir</strong>, você declara ciência e concordância com nossos{" "}
            <a href="/servicos" aria-label="Abrir Termos de Serviço">
              <strong>Termos de Serviço</strong>
            </a>{" "}
            e{" "}
            <a href="/privacidade" aria-label="Abrir Política de Privacidade">
              <strong>Política de Privacidade</strong>
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
