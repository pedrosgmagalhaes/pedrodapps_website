# Estilo de Scroll adotado no projeto

Este documento descreve o estilo de rolagem (scroll) que adotamos no site, incluindo comportamento visual, acessibilidade, performance e como aplicar o efeito de reveal ao entrar na viewport.

## Objetivos

- Melhorar percepção e leitura com entradas suaves de conteúdo ao rolar.
- Respeitar preferências de acessibilidade (redução de movimento).
- Manter boa performance, evitando cálculos pesados em eventos de scroll.
- Garantir que todo conteúdo essencial continue acessível sem depender exclusivamente de animações.

## Resumo do estilo aplicado

1. Rolagem suave global:
   - `html { scroll-behavior: smooth; }` (com fallback amigável para quem prefere menos movimento).
2. Efeito de revelar conteúdo ao entrar na viewport (ScrollReveal):
   - Utiliza `IntersectionObserver` para adicionar `.is-visible` em elementos `.reveal-on-scroll`.
   - Respeita `(prefers-reduced-motion: reduce)`, revelando sem animação quando habilitado.
   - Observa elementos adicionados dinamicamente via `MutationObserver`.
3. Barra de rolagem personalizada (Chromium/WebKit + Firefox):
   - Estilos para track/thumb e cores de scrollbar.

## Como funciona o ScrollReveal

Arquivo: `src/components/ScrollReveal.jsx`

- Envolve toda a aplicação (em `src/main.jsx`) e procura elementos com a classe `.reveal-on-scroll`.
- Quando o elemento entra ~10% na viewport (`threshold: 0.1`), o componente adiciona `.is-visible` e para de observar aquele elemento (melhor performance).
- Caso o navegador não suporte `IntersectionObserver`, todos os elementos são revelados imediatamente.
- Para usuários com preferência de movimento reduzido, revelamos imediatamente e desativamos transições.

Trecho simplificado do comportamento:

```jsx
// Em main.jsx
<ScrollReveal>
  <App />
</ScrollReveal>
```

## Estilos CSS (globais)

Arquivo: `src/index.css`

```css
/* Rolagem suave global */
html {
  scroll-behavior: smooth;
  /* Firefox scrollbar colors */
  scrollbar-color: #7747ff var(--bg-secondary);
}

/* Efeito de revelar ao rolar */
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;
  will-change: opacity, transform;
}

.reveal-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal-on-scroll {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

/* Scrollbar personalizada (WebKit/Chromium) */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}
::-webkit-scrollbar-thumb {
  background: #7747ff;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #7747ff;
}
```

## Como aplicar o efeito em novos elementos

1. Adicione `className="reveal-on-scroll"` ao elemento:

```jsx
<section className="reveal-on-scroll">
  <h2>Título</h2>
  <p>Conteúdo que aparecerá com efeito de entrada ao rolar.</p>
</section>
```

2. Opcionalmente, defina atrasos para escalonar entradas:

```jsx
<div className="reveal-on-scroll" style={{ transitionDelay: "0.2s" }}>
  Primeiro bloco
</div>
<div className="reveal-on-scroll" style={{ transitionDelay: "0.4s" }}>
  Segundo bloco
</div>
```

3. Elementos lazy-loaded também são revelados:

- O `MutationObserver` detecta nós adicionados depois e aplica observação/reveal automaticamente.

## Boas práticas de acessibilidade

- Preferência por menos movimento:
  - Respeitamos `(prefers-reduced-motion: reduce)` — sem transições e sem deslocamentos.
- Conteúdo essencial não deve depender apenas de animações.
- Foco e navegação por teclado devem permanecer visíveis e funcionais.

## Performance

- `IntersectionObserver` evita custos altos de escutas de `scroll` contínuas.
- Revelamos cada elemento uma única vez e deixamos de observar (menos trabalho).
- Transições curtas e baseadas em transform/opacity (evitam repaints pesados).

## Âncoras com cabeçalho fixo (opcional)

Se o site possui um header fixo (sticky), ao navegar para hashes (`#secao`) pode haver sobreposição do conteúdo. Para compensar:

```css
/* Ajuste para âncoras alvo, considerando altura do header */
:target {
  scroll-margin-top: 72px; /* ajuste conforme altura real do header */
}
/* Ou: */
html {
  scroll-padding-top: 72px; /* ajuste conforme altura real do header */
}
```

## Onde já usamos

- Hero, Stats, CTA, Services, Wallet, FAQ/FAQPro, JourneyBanner e Footer aplicam `.reveal-on-scroll` em seus blocos principais.
- O `ScrollReveal` está montado em `main.jsx`, envolvendo o `<App />`.

## Ajustes finos (se necessário)

- Revelar mais cedo/tarde: altere `threshold` e `rootMargin` no `ScrollReveal.jsx`.
- Ritmo de entradas: use `transitionDelay` por elemento para escalonar.
- Desativar rolagem suave para casos específicos: aplique CSS contextual com media query de `prefers-reduced-motion`.

## Referências

- MDN — IntersectionObserver: https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API
- MDN — scroll-behavior: https://developer.mozilla.org/docs/Web/CSS/scroll-behavior
- MDN — prefers-reduced-motion: https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion
- MDN — scroll-margin / scroll-padding: https://developer.mozilla.org/docs/Web/CSS/scroll-margin / https://developer.mozilla.org/docs/Web/CSS/scroll-padding
  ``
