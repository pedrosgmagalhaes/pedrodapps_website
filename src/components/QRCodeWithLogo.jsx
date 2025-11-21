import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

// Renderiza um QR Code com logo central sobreposta
// Props:
// - text: string (conteúdo do QR)
// - size: number (tamanho do canvas)
// - logoSrc: string (path da imagem de logo)
// - logoSize: number (tamanho da logo)
// - logoRadius: number (raio do fundo arredondado da logo)
// - logoBackground: string (cor de fundo atrás da logo)
// - className: string (classe CSS opcional)
// - ariaLabel: string (label acessível opcional)
export default function QRCodeWithLogo({
  text,
  size = 256,
  logoSrc,
  logoSize = 64,
  logoRadius = 10,
  logoBackground = "rgba(255,255,255,0.92)",
  className,
  ariaLabel,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;
    const draw = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        await QRCode.toCanvas(canvas, text, { width: size, margin: 2 });
        if (isCancelled) return;
        const ctx = canvas.getContext("2d");
        const cx = size / 2;
        const cy = size / 2;
        const pad = 10;
        const rectSize = logoSize + pad * 2;

        // Fundo arredondado atrás da logo para garantir contraste
        drawRoundedRect(ctx, cx - rectSize / 2, cy - rectSize / 2, rectSize, rectSize, logoRadius);
        ctx.fillStyle = logoBackground;
        ctx.fill();

        // Carregar logo e desenhar centralizada
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = logoSrc;
        img.onload = () => {
          if (isCancelled) return;
          ctx.drawImage(img, cx - logoSize / 2, cy - logoSize / 2, logoSize, logoSize);
        };
        img.onerror = () => {
          // Falha ao carregar logo: manter somente QR
          // Sem propagação de erro para evitar quebrar UI
        };
      } catch {
        // Falha ao renderizar QR: não lançar erro na UI
        // Poderíamos exibir um fallback, mas para simplicidade deixamos em silêncio
      }
    };
    draw();
    return () => {
      isCancelled = true;
    };
  }, [text, size, logoSrc, logoSize, logoRadius, logoBackground]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={ariaLabel || `QR Code para ${text}`}
    />
  );
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
