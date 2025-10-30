# 🚀 Sistema de Deploy Automático

Este documento explica como funciona o sistema de deploy automático do projeto PedroDapps Website.

## 📋 Visão Geral

O sistema automatiza todo o processo de deploy, desde o commit das alterações até a publicação no Firebase Hosting, em um único comando.

## 🛠️ Arquivos do Sistema

### 1. `scripts/deploy-all.cjs`
Script principal em Node.js que executa todas as etapas do deploy:

- **Git Operations**: `git add .`, `git commit`, `git push`
- **Build Process**: `yarn build` (compilação com Vite)
- **Firebase Deploy**: `firebase deploy` para produção
- **Error Handling**: Tratamento de erros em cada etapa
- **Colored Output**: Saída colorida no terminal para melhor visualização

### 2. `deploy.bat`
Script batch para Windows que facilita a execução:

- Verifica se Node.js está instalado
- Executa o script principal
- Pausa no final para visualizar resultados

### 3. `package.json`
Contém o script npm para execução:

```json
{
  "scripts": {
    "deploy:all": "node scripts/deploy-all.cjs"
  }
}
```

## 🎯 Como Usar

### Opção 1: Via Yarn/NPM
```bash
# Com mensagem personalizada
yarn deploy:all -m "sua mensagem de commit"

# Com mensagem padrão (timestamp automático)
yarn deploy:all
```

### Opção 2: Via Script Batch (Windows)
```bash
# Duplo clique no arquivo ou via terminal
./deploy.bat -m "sua mensagem de commit"
```

### Opção 3: Execução Direta
```bash
node scripts/deploy-all.cjs -m "sua mensagem de commit"
```

## ⚙️ Parâmetros

### `-m, --message`
Define a mensagem do commit Git.

**Exemplos:**
```bash
yarn deploy:all -m "feat: nova funcionalidade"
yarn deploy:all -m "fix: correção de bug"
yarn deploy:all -m "docs: atualização da documentação"
```

**Padrão:** Se não especificado, usa timestamp automático:
```
Deploy automático - 2024-01-15 14:30:25
```

## 🔄 Fluxo de Execução

1. **🔍 Verificação Git**
   - Verifica se há alterações para commit
   - Exibe status atual do repositório

2. **📦 Git Add**
   - Adiciona todas as alterações (`git add .`)

3. **💾 Git Commit**
   - Cria commit com mensagem especificada ou padrão

4. **🌐 Git Push**
   - Envia alterações para o repositório remoto

5. **🏗️ Build**
   - Executa `yarn build` para compilar o projeto
   - Gera arquivos otimizados na pasta `dist/`

6. **🚀 Firebase Deploy**
   - Faz deploy dos arquivos para Firebase Hosting
   - Atualiza o site em produção

## ✅ Saídas de Sucesso

```bash
✅ Git add concluído!
✅ Git commit concluído!
✅ Git push concluído!
✅ Build concluído!
✅ Deploy no Firebase concluído!

🎉 Deploy concluído com sucesso!
🌐 Seu site foi atualizado no Firebase Hosting
```

## ❌ Tratamento de Erros

O script para a execução se alguma etapa falhar:

- **Git errors**: Problemas com repositório ou conflitos
- **Build errors**: Erros de compilação ou dependências
- **Firebase errors**: Problemas de autenticação ou configuração

## 🔧 Pré-requisitos

1. **Node.js** instalado
2. **Yarn** instalado
3. **Git** configurado
4. **Firebase CLI** autenticado
5. **Repositório Git** configurado

## 🌐 URLs de Produção

Após deploy bem-sucedido, o site estará disponível em:
- **Firebase Hosting**: https://pedrodapps-website.web.app
- **Console Firebase**: https://console.firebase.google.com/project/pedrodapps-website

## 🔒 Segurança

- Nunca commita credenciais ou chaves de API
- O script não expõe informações sensíveis
- Logs são seguros para compartilhamento

## 🐛 Troubleshooting

### Erro: "require is not defined"
**Solução**: O arquivo deve ter extensão `.cjs` para usar CommonJS em projetos ES modules.

### Erro: "Firebase not authenticated"
**Solução**: Execute `firebase login` para autenticar.

### Erro: "Git repository not found"
**Solução**: Certifique-se de estar na pasta raiz do projeto.

## 📝 Convenções de Commit

Recomendamos usar convenções semânticas:

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação/estilo
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Tarefas de manutenção

## 🎯 Exemplo Completo

```bash
# 1. Fazer alterações no código
# 2. Executar deploy
yarn deploy:all -m "feat: implementação da área VIP com cronômetro"

# Output esperado:
# ✅ Git add concluído!
# ✅ Git commit concluído!
# ✅ Git push concluído!
# ✅ Build concluído!
# ✅ Deploy no Firebase concluído!
# 🎉 Deploy concluído com sucesso!
```

---

**Desenvolvido para PedroDapps Website** 🚀