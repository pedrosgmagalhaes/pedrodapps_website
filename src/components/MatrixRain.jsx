import React, { useRef, useEffect } from "react";

export default function MatrixRain({ accent = "rgb(123, 227, 61)" }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const setSize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    setSize();

    const fontSize = 14; // mais leve/miúdo
    const columnWidth = fontSize * 1.2; // espaçamento maior para menos densidade
    const columns = () => Math.max(10, Math.floor(width / columnWidth));
    let drops = new Array(columns()).fill(1);

    const characters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ$%&*+#".split("");
    const accentAlpha = accent.startsWith("rgb(")
      ? accent.replace("rgb(", "rgba(").replace(")", ", 0.28)")
      : accent; // reduz opacidade do verde

    const draw = () => {
      // limpar completamente para não cobrir a imagem de fundo
      ctx.clearRect(0, 0, width, height);

      // texto com verde translúcido
      ctx.fillStyle = accentAlpha;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 1; // velocidade padrão
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    // throttle resize
    const handleResize = () => {
      if (timeoutRef.current) return;
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        setSize();
        drops = new Array(columns()).fill(1);
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [accent]);

  return (
    <div className="hero__matrix" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}