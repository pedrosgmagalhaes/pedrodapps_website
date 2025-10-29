# Esquema de cores do site

Este documento descreve o conjunto de cores utilizado no projeto, com base nos tokens CSS definidos em `:root` (arquivo `src/index.css`) e nos gradientes/tons complementares usados em componentes.

## Visão geral
- Paleta base escura, com fundos profundos e texto claro.
- Cor de marca principal: Electric Violet (`#7747ff`), usada para destaques, links e elementos interativos.
- Uso extensivo de variáveis CSS (`var(--nome-da-variavel)`) para consistência.

## Tokens principais (variáveis CSS)

### Fundos e superfícies
- `--bg-primary: #0d0c13` — Fundo base da página.
- `--bg-secondary: #050508` — Fundo secundário, áreas mais profundas.
- `--bg-tertiary: #0f0e16` — Fundo terciário.
- `--bg-quaternary: #23154c` — Fundo quaternário (tom violeta muito escuro).
- `--bg-card: #0f0e16` — Fundo de cartões/containers.
- `--surface-color: #050508`
- `--background-color: #0d0c13`

### Texto
- `--text-primary: #fff` — Texto principal.
- `--text-secondary: #f2f2f2` — Texto secundário.
- `--text-muted: #595960` — Texto atenuado.

### Paleta Electric Violet (marca)
- `--electric-violet-lightest: #f8ecff`
- `--electric-violet-lighter: #e3daff`
- `--electric-violet-light: #bf7eff`
- `--electric-violet: #7747ff` — Cor de marca principal.
- `--electric-violet-dark: #5f3bcc`
- `--electric-violet-darker: #2FC56` — Observação: valor parece inválido (hex incompleto). Ver seção "Observações".
- `--electric-violet-darkest: #23154c`

### Neutros
- `--neutral-white: #fff`
- `--neutral-lightest: #f2f2f2`
- `--neutral-lighter: #d8d8d8`
- `--neutral-light: #d2d2d2`
- `--neutral: #7f7f7f`
- `--neutral-dark: #4c4c4c`
- `--neutral-darker: #191919`
- `--neutral-darkest: #000`

### Escala de pretos
- `--black-lightest: #e7e7e8`
- `--black-lighter: #cfcfd1`
- `--black-light: #555560`
- `--black: #19191c`
- `--black-dark: #0f0e16`
- `--black-darker: #070708`
- `--black-darkest: #050508`

### Paleta "Concrete"
- `--concrete-lightest: #fdfdfd`
- `--concrete-lighter: #fcfcfc`
- `--concrete-light: #f8f8f8`
- `--concrete: #f3f3f3`
- `--concrete-dark: #c2c2c2`
- `--concrete-darker: #616161`
- `--concrete-darkest: #484848`

### Acentos e bordas
- `--primary-color: #7747ff`
- `--accent-primary: #7747ff`
- `--accent-secondary: #7747ff`
- `--accent-tertiary: #23154c`
- `--border-color: #23154c`

### Gradientes principais
- `--gradient-primary: linear-gradient(135deg, #bf7eff 0%, #7747ff 50%, #23154c 100%)`
- `--gradient-bg: linear-gradient(180deg, #000 0%, #0f0e16 50%, #23154c 100%)`

## Tons/gradientes complementares presentes em componentes
Alguns componentes usam gradientes e tons complementares fora dos tokens principais, tipicamente para realces visuais:

### Services.jsx
- `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`
- `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`

### Hero.css
- `linear-gradient(135deg, #ff6b6b, #ee5a52)`
- `linear-gradient(135deg, #4ecdc4, #44a08d)`
- `linear-gradient(135deg, #45b7d1, #96c93d)`
- `linear-gradient(135deg, #f093fb, #f5576c)`

### JourneyBanner.css (exemplos)
- Borda/realce: `#b9a7ff`
- Acento (marca): `#7747ff`

### Footer.css (exemplos de tons neutros claros)
- `#e9eaec`, `#f1f2f4`, `#b7b9bf`, `#f5f6f7`, `#1c1c20`, `#92ffb1` (realce verde), `#cfd1d5`, `#8b8d93`, `#9ea1a6`

### Outros
- Tons de interface pontuais: `#a0a0a0`, `#ccc`, `#fff`, `#191822`, `#282828`, etc.

## Diretrizes de uso
- Preferir `var(--accent-primary)`/`var(--primary-color)` para elementos interativos (links, botões, ícones de ação).
- Usar `var(--bg-primary)`/`var(--bg-secondary)` como fundos principais; `var(--bg-card)` em cartões e containers.
- Empregar `var(--border-color)` em contornos/linhas divisórias quando necessário.
- Para texto, manter `var(--text-primary)` sobre fundos escuros e `var(--text-secondary)`/`var(--text-muted)` para hierarquia.
- Usar `var(--gradient-primary)` em destaques de texto/áreas hero; `var(--gradient-bg)` para fundos de seção.
- Observação de acessibilidade: manter contraste suficiente (alvo mínimo 4.5:1) entre texto e fundo.

## Exemplos de uso
```css
.button-primary {
  background: var(--accent-primary);
  color: var(--neutral-white);
}

.section-hero {
  background: var(--gradient-bg);
}

.badge-brand {
  background: var(--electric-violet);
  color: var(--neutral-white);
}

.text-muted {
  color: var(--text-muted);
}
```

## Observações
- `--electric-violet-darker: #2FC56` aparenta ser um valor inválido (hex de 5 dígitos). Recomenda-se revisar e corrigir para um hex válido (3 ou 6 dígitos), alinhado à escala da marca. Sugestão de ação: confirmar o valor desejado e atualizar em `src/index.css`.
- Para manter consistência, considerar migrar gradientes/tônicos complementares (usados diretamente em componentes) para tokens em `:root` se forem parte do design system.

---
Última atualização: gerada automaticamente com base no código do repositório atual.

## Identidade visual expandida

### Tipografia
- Família: "Saira" (fallbacks: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif).
- Tamanhos (tokens em `:root`):
  - `--font-size-xs: 0.75rem`, `--font-size-sm: 0.875rem`, `--font-size-base: 1rem`, `--font-size-lg: 1.125rem`, `--font-size-xl: 1.25rem`, `--font-size-2xl: 1.5rem`, `--font-size-3xl: 1.875rem`, `--font-size-4xl: 2.25rem`, `--font-size-5xl: 3rem`, `--font-size-6xl: 3.75rem`.
- Pesos usados no projeto: 400, 500, 600, 700, 800 (vide componentes Hero/Stats/Footer).
- Boas práticas: usar `letter-spacing` levemente negativo em títulos (como `-0.01em` a `-0.02em`) e `line-height` entre 1.2–1.55.

### Espaçamentos e grid
- Tokens de espaçamento: `--spacing-xs: 0.25rem`, `--spacing-sm: 0.5rem`, `--spacing-md: 1rem`, `--spacing-lg: 1.5rem`, `--spacing-xl: 2rem`, `--spacing-2xl: 3rem`, `--spacing-3xl: 4rem`, `--spacing-4xl: 6rem`.
- Container padrão: largura máxima 1200px, com padding responsivo.
- Breakpoints (detectados nos componentes):
  - `<= 1200px`, `<= 1024px`, `<= 768px`, `<= 480px` e `>= 768px` (para ajuste de padding).
- Diretriz: em `<= 768px`, preferir colunas únicas e maiores espaçamentos verticais.

### Bordas e raios
- Tokens: `--border-radius-sm: 0.375rem`, `--border-radius-md: 0.5rem`, `--border-radius-lg: 0.75rem`, `--border-radius-xl: 1rem`.
- Padrões de uso: `9999px` para pílulas e ícones circulares, `8px` para botões sociais, `16px` para cards/menus.

### Sombras
- Tokens (em `:root`):
  - `--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 5%)`
  - `--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 10%)`
  - `--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 10%)`
  - `--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 10%)`
- Diretriz: aplicar `--shadow-lg` em hovers de botões/card, e sombras mais fortes (ex. `rgb(0 0 0 / 20–32%)`) em cabeçalhos flutuantes.

### Botões e links
- Utilitários globais:
  - `.btn` base com `border-radius: var(--border-radius-md)`, `font-weight: 500`, `transition: all 0.2s ease`.
  - `.btn-primary`: `background: var(--gradient-primary)`, hover com leve elevação (`transform: translateY(-2px)` + `box-shadow: var(--shadow-lg)`).
  - `.btn-secondary`: `border: 1px solid var(--border-color)`; no hover, `border-color` e texto migram para `var(--accent-primary)`.
- Padrões CTA: links com `color: #fff` que mudam para `#7747ff` no hover; ícones ~20px com `currentColor`.
- Botões sociais: 36–40px, `border-radius: 8px`, borda `rgb(255 255 255 / 8%)`, hover com `border-color: rgb(119 71 255 / 45%)`.

### Iconografia
- Biblioteca: `react-icons` (ex.: `SiX` para o X/Twitter).
- Tamanhos recomendados: 20px para inline em texto/botões; 24–40px para ações sociais; usar `currentColor` para herdar o acento.
- Acessibilidade: incluir `aria-label` descritivo nos links com ícones.

### Logotipo e imagética
- Arquivos: `src/assets/pixley_logo_icon_violet.svg`, `pixley_logo_white.png`, `pixley_logo_violet.png`.
- Uso: preferir versão branca/violeta sobre fundos escuros; pode-se aplicar `filter: brightness(1.2)` para realce.
- Espaçamento seguro: manter margem mínima de `var(--spacing-md)` ao redor.

### Animações e transições
- Padrões comuns: `0.2–0.3s ease` para hovers; `cubic-bezier(0.4, 0, 0.2, 1)` em elementos com movimento suave.
- Utilitários: `.fade-in` (0.6s ease), `.transition-slow` (0.8s ease), `.animate-pulse-slow` (1.2s ease-in-out).
- Diretriz de acessibilidade: respeitar `@media (prefers-reduced-motion: reduce)` desativando transições/animações.

### Acessibilidade
- Contraste: mínimo 4.5:1 entre texto e fundo.
- Foco visível (sugestão):
```css
:focus-visible {
  outline: 2px solid #7747ff;
  outline-offset: 2px;
}
```
- Alto contraste: usar `@media (prefers-contrast: high)` para reforçar bordas/cores de texto.

### Gradientes complementares
- Em uso (Services/Hero): combinações como `#667eea→#764ba2`, `#f093fb→#f5576c`, `#4facfe→#00f2fe`.
- Diretriz: se forem parte do design system, promover para tokens (ex.: `--gradient-services-1`, `--gradient-hero-1`).

### Extras
- Scrollbar personalizada: trilha `var(--bg-secondary)` e polegar `#7747ff` com `border-radius: 4px`.
- Container: `max-width: 1200px` e padding responsivo.
- Observação: revisar `--electric-violet-darker` (hex inválido) e definir um valor correto para a escala da marca.
