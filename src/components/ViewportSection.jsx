import React, { useEffect, useRef, useState } from "react";

// Renderiza children somente quando o wrapper entra na viewport.
// Evita montar componentes pesados até serem necessários.
export default function ViewportSection({
  children,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  minHeight = 180,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, isVisible]);

  return (
    <div ref={ref} style={{ minHeight: isVisible ? undefined : minHeight }}>
      {isVisible ? children : null}
    </div>
  );
}
