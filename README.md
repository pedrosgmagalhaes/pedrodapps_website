# Pedro dApps Website

Site institucional da Pedro dApps desenvolvido em React com Vite.

## 🚀 Tecnologias

- React 19
- Vite 7
- ESLint
- CSS modular

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 18+
- Yarn

### Instalação
```bash
# Instalar dependências
yarn

# Iniciar desenvolvimento
yarn dev
```

### Scripts
- `yarn dev` - Servidor de desenvolvimento
- `yarn build` - Build de produção
- `yarn preview` - Preview do build
- `yarn lint` - Verificação de código

## 📁 Estrutura

```
src/
├── components/     # Componentes React
├── assets/         # Imagens e ícones
├── App.jsx         # Componente principal
└── index.css       # Estilos globais
```

## ✨ Funcionalidades

- Animações de scroll reveal
- Design responsivo
- Otimização de performance
- Acessibilidade (WCAG)

## 🚀 Deploy

### Firebase Hosting
```bash
# Deploy staging
yarn deploy:staging

# Deploy produção
yarn deploy:firebase
```

### Configuração
- Projeto: `pedrodapps-website`
- Site produção: `pedrodapps-website`
- Multi-site configurado via `.firebaserc`

### Acesso em Produção
- **URL Firebase**: `https://pedrodapps-website.web.app`
- **URL Kong (servidor)**: `https://pedrodapps.com` (via Kong proxy)
- **URL Alternativa**: `https://www.pedrodapps.com`
- **Kong Admin**: `http://187.108.196.14:8001` (apenas localhost)
- **Jenkins**: `http://187.108.196.14:8080`

## 📄 Licença

Todos os direitos reservados à Pedro dApps.
