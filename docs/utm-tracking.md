# Rastreamento de UTM e Marketing no Checkout

Este documento descreve como os parâmetros de marketing (UTM e correlatos) são capturados, propagados e enviados ao backend e à telemetria no site da Pedro dApps.

## Visão Geral

- Os parâmetros UTM presentes na URL de entrada são preservados nas CTAs e levados até a página de checkout.
- O checkout lê os parâmetros para compor o contexto de compra e para telemetria.
- As chamadas ao backend incluem os mesmos parâmetros da URL atual, permitindo regras de preço/marketing no servidor.

## Parâmetros Suportados

São preservados e coletados automaticamente:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `ref`
- `origin`
- `gclid`
- `fbclid`
- `lang`

## Propagação nas CTAs

- As CTAs constroem o `href` do checkout preservando os UTM presentes na página atual e adicionando `course` e `product` padrão:
  - Header: `src/components/Header.jsx:33-41`
  - Contato/Hero: `src/components/ContactCTA.jsx:17-22`
  - Acesso 30 dias: `src/components/Access30Days.jsx:41-46`
  - VIP Card: `src/components/VipArea.jsx:165-170`
  - Lessons bloqueadas: `src/components/Lessons.jsx:138-141`
  - Bot honeypot bloqueado: `src/components/bots/HoneypotDetector.jsx:119-123`

Exemplo de geração de URL nas CTAs:

```text
/checkout?course=builders-de-elite&product=plan-anual&utm_source=ads&utm_medium=cpc&utm_campaign=vip
```

## Consumo no Checkout

- O checkout lê `course` e `product` e coleta UTM da `location.search`:
  - Leitura de `course`/`product`: `src/components/Checkout.jsx:24-25`
  - Coleta de UTM: `src/components/Checkout.jsx:36-49`

- Metadados persistidos localmente (incluindo marketing) e enviados à telemetria:
  - Persistência: `src/components/Checkout.jsx:167-179`
  - Telemetria: `src/components/Checkout.jsx:177-179`

## Encaminhamento para o Backend

- Todos os parâmetros da URL atual (incluindo UTM) são repassados às APIs do curso:
  - Contexto de checkout: `API.courses.checkoutContext()` repassa `queryParams` (UTM) — `src/lib/api.js:80-99`
  - Stripe: `API.courses.checkoutStripe()` usa `Accept-Language` e dados de recibo — `src/lib/api.js:100-111`
  - Base URL dinâmica via `getBaseURL()` — `src/lib/api.js:16-21`

## Telemetria de Checkout

- Os eventos de telemetria incluem automaticamente UTM capturados da URL, além de `sessionId` e `lang`:
  - Coleta e envio: `src/lib/checkoutTelemetry.js:1-72`

Eventos enviados incluem (exemplos):

- `pageview`
- `method_change`
- `cta_click`
- `purchase_start`
- `purchase_confirm`

## Preço e Produto

- O resumo do checkout exibe nome do produto e total apenas com dados vindos do backend. Sem valores locais hardcoded:
  - Resumo: `src/components/Checkout.jsx:387-396`
  - Cálculo de preço: `src/components/Checkout.jsx:140-143`

## Exemplos de URLs

- Builders Anual:
  - `http://localhost:8086/checkout?course=builders-de-elite&product=plan-anual&utm_source=ads&utm_medium=cpc`
- Builders Mensal:
  - `http://localhost:8086/checkout?course=builders-de-elite&product=plan-mensal&utm_campaign=vip`
- Acesso 30 dias:
  - `http://localhost:8086/checkout?course=builders-de-elite&product=acesso-30-dias&utm_source=affiliate`

## Como Adicionar Uma Nova CTA com UTM

1. Importe `useLocation` do `react-router-dom`.
2. Construa `href` usando `new URLSearchParams` com `course` e `product` e mescle os UTM presentes em `location.search`.
3. Use esse `href` no link/botão.

Exemplo (padrão usado nas telas):

```js
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
  return `/checkout?${base.toString()}`;
};
```

## Teste e Validação

- Acesse a home com UTM: `/?utm_source=ads&utm_medium=cpc&utm_campaign=vip`.
- Clique em qualquer CTA para ir ao checkout; verifique a preservação das UTM na URL.
- Confirme que o resumo exibe dados de produto/preço do backend (ou `—` se indisponível).
- Valide eventos no backend via endpoint de telemetria se disponível.

## Boas Práticas de Privacidade

- Coletar apenas o necessário para atribuição e métricas.
- Evite incluir dados pessoais em UTM.
- Respeitar `Accept-Language` e preferências do usuário.

## Troubleshooting

- UTM não aparecem no checkout:
  - Verifique se a navegação para o checkout usa as CTAs padrão com propagação.
  - Cheque que a home foi acessada com UTM na query.

- Preço exibindo `—`:
  - Falta de `ctx.product.totalCents` ou `ctx.course.priceCents` do backend. Verifique o endpoint de contexto.
