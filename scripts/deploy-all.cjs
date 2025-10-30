#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function executeCommand(command, description) {
  try {
    log(`\n🔄 ${description}...`, 'cyan');
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    log(`✅ ${description} concluído!`, 'green');
    return output;
  } catch (error) {
    log(`❌ Erro ao executar: ${description}`, 'red');
    log(`Comando: ${command}`, 'yellow');
    log(`Erro: ${error.message}`, 'red');
    process.exit(1);
  }
}

function getCommitMessage() {
  const args = process.argv.slice(2);
  const messageIndex = args.findIndex(arg => arg === '-m' || arg === '--message');
  
  if (messageIndex !== -1 && args[messageIndex + 1]) {
    return args[messageIndex + 1];
  }
  
  // Mensagem padrão com timestamp
  const now = new Date();
  const timestamp = now.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return `feat: atualizações do site - ${timestamp}`;
}

function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim().length > 0;
  } catch (error) {
    log('❌ Erro ao verificar status do git', 'red');
    return false;
  }
}

function main() {
  log('🚀 Iniciando processo de deploy automático...', 'bright');
  log('📁 Diretório: ' + process.cwd(), 'blue');
  
  // Verificar se há mudanças para commit
  if (!checkGitStatus()) {
    log('ℹ️  Nenhuma mudança detectada para commit', 'yellow');
    log('🔄 Prosseguindo apenas com o deploy...', 'cyan');
  } else {
    const commitMessage = getCommitMessage();
    log(`📝 Mensagem do commit: "${commitMessage}"`, 'blue');
    
    // Git add
    executeCommand('git add .', 'Adicionando arquivos ao git');
    
    // Git commit
    executeCommand(`git commit -m "${commitMessage}"`, 'Fazendo commit das mudanças');
    
    // Git push
    executeCommand('git push', 'Enviando mudanças para o repositório');
  }
  
  // Build do projeto
  executeCommand('yarn build', 'Fazendo build do projeto');
  
  // Deploy no Firebase
  executeCommand('firebase deploy', 'Fazendo deploy no Firebase');
  
  log('\n🎉 Deploy concluído com sucesso!', 'green');
  log('🌐 Seu site foi atualizado no Firebase Hosting', 'cyan');
}

// Verificar se está no diretório correto
if (!fs.existsSync('package.json')) {
  log('❌ Erro: package.json não encontrado', 'red');
  log('Execute este script na raiz do projeto', 'yellow');
  process.exit(1);
}

// Verificar se Firebase CLI está instalado
try {
  execSync('firebase --version', { stdio: 'ignore' });
} catch (error) {
  log('❌ Firebase CLI não encontrado', 'red');
  log('Instale com: npm install -g firebase-tools', 'yellow');
  process.exit(1);
}

// Executar o script principal
main();