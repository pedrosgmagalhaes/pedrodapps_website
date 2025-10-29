# Pixley Website (React + Vite)

Site institucional da Pixley desenvolvido em React com Vite. Este repositório contém a landing page com seções como Cabeçalho, Hero, Serviços, Carteira/Exchange, Estatísticas, FAQs, CTA e Banner de Jornada, além de um sistema de animações de entrada ao rolar (scroll-reveal).

## Stack técnica

- React 19
- Vite 7
- ESLint (Flat config + React Hooks/Refresh)
- Lucide React e React Icons (ícones)
- CSS modular por componente + utilitários globais em `src/index.css`

## Pré-requisitos

- Node.js 18 ou superior
- Yarn (Classic) 1.x

## Instalação e execução com Yarn

- Instalar dependências: `yarn`
- Ambiente de desenvolvimento: `yarn dev`
- Lint do projeto (auto-fix): `yarn lint`
- Build de produção: `yarn build`
- Preview do build: `yarn preview`

O servidor de desenvolvimento é iniciado pelo Vite e estará disponível em uma porta local (ex.: `http://localhost:5176/`). Verifique o terminal para a URL exata.

## Estrutura do projeto

- `src/main.jsx` e `src/App.jsx`: bootstrap e composição principal da aplicação
- `src/index.css`: estilos globais e utilitários (inclui classes de scroll-reveal)
- `src/components/`: componentes e estilos específicos
  - `Header.jsx` / `Header.css`
  - `Hero.jsx` / `Hero.css`
  - `Services.jsx` / `Services.css`
  - `Wallet.jsx` / `Wallet.css`
  - `Stats.jsx` / `Stats.css`
  - `FAQ.jsx` / `FAQ.css`
  - `FAQPro.jsx` / `FAQPro.css`
  - `CTA.jsx` / `CTA.css`
  - `JourneyBanner.jsx` / `JourneyBanner.css`
  - `Footer.jsx` / `Footer.css`
- `src/assets/`: imagens e ícones

## Animações por scroll (scroll-reveal)

Implementamos um efeito de fade-in ao rolar:

- CSS utilitário em `index.css`:
  - `.reveal-on-scroll` (estado inicial: opacidade 0 e leve translateY)
  - `.is-visible` (estado animado: opacidade 1 e translateY 0)
  - Respeita `prefers-reduced-motion`
- `App.jsx` contém um `IntersectionObserver` para adicionar `.is-visible` automaticamente quando o elemento entra na viewport.
- Para aplicar em novos elementos: adicione `className="reveal-on-scroll"` e, opcionalmente, um `style={{ transitionDelay: '0.2s' }}` para escalonar a entrada.

## Convenções de linguagem e conteúdo

- Slugs, endereços e código permanecem em inglês (ex.: ids de componentes, rotas, etc.).
- Textos visíveis ao usuário estão em português.
- "Exchange" é mantido em inglês nos textos visíveis (por decisão de produto).
- "Crypto POS" foi padronizado como "Maquininha Cripto" em títulos/descrições visíveis.
- Acessibilidade: alt/textos e `aria-*` em português quando visíveis (ex.: `alt="Perfil"`).

## Boas práticas de acessibilidade e performance

- Uso de `alt` e `aria-label` nos botões e ícones
- Suporte a pessoas com sensibilidade a movimento via `prefers-reduced-motion`
- Animações leves baseadas em transform/opacidade

## Build e deploy (Firebase Hosting)

Este projeto está preparado para multi-site no Firebase Hosting:

- Projeto Firebase: `pixley-website`
- Sites:
  - `pixley-website` (default do projeto)
  - `pixleywebsite-98c8e3` (site oficial/produção) — mapeado no CLI com o target `oficial`
- Arquivos relevantes:
  - `.firebaserc`: contém o target `oficial` apontando para `pixleywebsite-98c8e3`
  - `firebase.json`: configuração multi-site (array `hosting`) com SPA rewrites e cache headers

### Scripts de deploy

- Staging (Preview Channel): `yarn deploy:staging` ou `npm run deploy:staging`
  - Constrói o projeto e publica em um canal de preview chamado `staging` no site `pixleywebsite-98c8e3`.
  - Exemplo de URL (variável por release): `https://pixleywebsite-98c8e3--staging-<hash>.web.app/`
  - Observação: Se o projeto usar Firebase Auth, adicione o domínio do canal em Authentication > Domínios autorizados.
- Produção (Live): `yarn deploy:firebase` ou `npm run deploy:firebase`
  - Publica no site oficial `pixleywebsite-98c8e3` (target `oficial`).

- CLI direto (opcional):
  - Deploy de produção via CLI: `firebase deploy --only hosting:oficial --project pixley-website`
  - Deploy de Preview Channel via CLI: `firebase hosting:channel:deploy staging --only oficial --project pixley-website`

### Credenciais (opcional) via Google Secret Manager

O script de deploy (`scripts/deploy-firebase.js`) prioriza credenciais na seguinte ordem:

1. Variável de ambiente `FIREBASE_TOKEN`
2. Secret Manager (ex.: segredo `FIREBASE_TOKEN` no projeto `pixley-website`)
3. Login local no Firebase CLI

Passos recomendados se desejar CI/CD com secrets:

- Gerar token: `firebase login:ci`
- Habilitar Secret Manager no Cloud Console
- Criar segredo: `FIREBASE_TOKEN` com o token gerado
- Garantir acesso da conta de CI ao segredo (permissões Secret Manager Secret Accessor)

## Scripts disponíveis (Yarn)

- `yarn dev`: inicia o servidor de desenvolvimento (Vite)
- `yarn build`: compila para produção
- `yarn preview`: serve o build de produção localmente
- `yarn lint`: aplica auto-fix de lint/format em CSS, JSX/JS, HTML, YAML e arquivos de texto
- `yarn deploy:staging`: deploy para canal de preview
- `yarn deploy:firebase`: deploy para produção

## Lint e formatação

Para cobrir CSS, JSX/JS, HTML e YAML com auto-fix:

- ESLint (JS/JSX): regras recomendadas + React Hooks/Refresh
- Stylelint (CSS): `stylelint-config-standard`
- Prettier (HTML, YAML, CSS, JS/JSX, JSON, MD): formatação consistente

Scripts:

- `yarn lint` — executa, em sequência, auto-fix de ESLint, Stylelint e Prettier
- `yarn lint:check` — apenas verificação (sem escrita)
- `npm run lint` — equivalente a `yarn lint`
- `npm run lint:check` — equivalente a `yarn lint:check`

Arquivos de configuração:

- `eslint.config.js` — Flat config para JS/JSX
- `stylelint.config.cjs` — Configuração para CSS
- `.prettierrc` e `.prettierignore` — Formatação (HTML/YAML/etc.) e exclusões

## Contribuição

- Padronize textos visíveis em PT-BR e respeite a convenção de manter slugs/código em EN.
- Ao introduzir novos componentes, inclua estilos dedicados e considere aplicar `reveal-on-scroll`.
- Execute `yarn lint` antes de enviar alterações.

## Licença

Este repositório não contém uma licença explícita. Adicione uma licença caso necessário conforme as políticas da organização.
