/* global __APP_VITE_GOOGLE_CLIENT_ID__ */
import React, { useEffect, useRef, useState } from "react";
import { loginWithGoogle } from "../lib/auth";

export default function GoogleLogin({ onSuccess, onError }) {
  const btnRef = useRef(null);
  const initializedRef = useRef(false);
  const [missingClientId, setMissingClientId] = useState(false);

  useEffect(() => {
    const clientId = import.meta?.env?.VITE_GOOGLE_CLIENT_ID || (typeof __APP_VITE_GOOGLE_CLIENT_ID__ !== "undefined" ? __APP_VITE_GOOGLE_CLIENT_ID__ : undefined);
    if (!clientId) {
      console.warn("VITE_GOOGLE_CLIENT_ID não definido. Google Login desativado.");
      setMissingClientId(true);
      return;
    }
    let timerId;
    let attempts = 0;
    const maxAttempts = 40; // ~12s

    const init = () => {
      if (window.google?.accounts?.id) {
        if (initializedRef.current) {
          // Evita reinicialização dupla em StrictMode/Dev
          return;
        }
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              const cred = response?.credential;
              if (!cred) throw new Error("Credencial Google ausente");
              const user = await loginWithGoogle(cred);
              onSuccess?.(user);
            } catch (err) {
              console.error(err);
              onError?.(err);
            }
          },
          // Habilita FedCM para One Tap e melhora compatibilidade (Safari ITP)
          use_fedcm_for_prompt: true,
          // Habilita FedCM também para o fluxo do botão personalizado
          use_fedcm_for_button: true,
          itp_support: true,
          context: "signin",
        });
        initializedRef.current = true;

        if (btnRef.current) {
          // ocupar 100% da largura disponível no card
          if (btnRef.current?.style) {
            btnRef.current.style.width = "100%";
          }
          const rect = typeof btnRef.current?.getBoundingClientRect === "function"
            ? btnRef.current.getBoundingClientRect()
            : null;
          const width = rect ? Math.floor(rect.width) : (btnRef.current?.offsetWidth || 320);
          if (typeof console !== "undefined" && console.log) {
            console.log("[GoogleLogin] Renderizando botão com largura:", width);
          }
          window.google.accounts.id.renderButton(btnRef.current, {
            type: "standard",
            theme: "outline", // fundo transparente com borda
            size: "large",
            text: "continue_with",
            shape: "rectangular",
            logo_alignment: "left",
            width,
          });
        }

        // Exibir One Tap; se suprimido, mantém botão como fallback
        if (window.google?.accounts?.id?.prompt) {
          window.google.accounts.id.prompt((notification) => {
            try {
              const type = typeof notification?.getMomentType === "function" ? notification.getMomentType() : null;
              const notDisplayed = typeof notification?.getNotDisplayedReason === "function" ? notification.getNotDisplayedReason() : null;
              const skipped = typeof notification?.getSkippedReason === "function" ? notification.getSkippedReason() : null;
              const dismissed = typeof notification?.getDismissedReason === "function" ? notification.getDismissedReason() : null;
              if (typeof console !== "undefined" && console.debug) {
                console.debug("[GoogleLogin] One Tap moment:", { type, notDisplayed, skipped, dismissed });
              }
            } catch {
              // Ignora falhas em ambientes sem FedCM ou em navegadores antigos
            }
          });
        }
      } else if (attempts < maxAttempts) {
        attempts += 1;
        timerId = setTimeout(init, 300);
      } else {
        console.warn("Google Identity Services não carregou a tempo.");
      }
    };

    init();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [onSuccess, onError]);

  if (missingClientId && import.meta?.env?.DEV) {
    return (
      <div style={{
        width: "100%",
        maxWidth: 420,
        margin: "8px 0",
        textAlign: "center",
        color: "rgb(255 255 255 / 65%)",
        fontWeight: 300,
        fontSize: 12,
        lineHeight: 1.6,
      }}>
        Configure <code>VITE_GOOGLE_CLIENT_ID</code> em <code>.env.local</code> e reinicie o servidor para habilitar o login com Google.
      </div>
    );
  }

  return <div ref={btnRef} className="login__google-btn" />;
}