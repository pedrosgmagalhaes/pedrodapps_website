pipeline {
  agent any
  options {
    timestamps()
    ansiColor('xterm')
    disableConcurrentBuilds()
  }
  environment {
    DEPLOY_DIR = '/var/www/pedrodapps_website'
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Prepare Node & Yarn') {
      steps {
        sh '''
          set -euxo pipefail

          # Node.js
          if ! command -v node >/dev/null 2>&1; then
            echo "Node.js não encontrado. Instale Node 18+ (recomendado: 20.x) no servidor Jenkins."
            node --version || true
            exit 1
          fi
          node -v

          # Yarn (clássico 1.x)
          if ! command -v yarn >/dev/null 2>&1; then
            if command -v corepack >/dev/null 2>&1; then
              corepack enable || true
            fi
            # tenta instalar Yarn 1.x globalmente
            (sudo npm i -g yarn@1.22.22 || npm i -g yarn@1.22.22) || true
          fi
          yarn -v || true
        '''
      }
    }

    stage('Install deps') {
      steps {
        sh '''
          set -euxo pipefail
          yarn install --frozen-lockfile || yarn install
        '''
      }
    }

    stage('Build') {
      steps {
        sh '''
          set -euxo pipefail
          yarn build
        '''
      }
    }

    stage('Deploy to Nginx root') {
      steps {
        sh '''
          set -euxo pipefail
          # copia artefatos para a pasta servida pelo Nginx
          sudo mkdir -p "$DEPLOY_DIR"
          sudo rsync -a --delete dist/ "$DEPLOY_DIR"/
          sudo chown -R www-data:www-data "$DEPLOY_DIR" || true
        '''
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'dist/**', fingerprint: true
    }
    success {
      echo 'Build e deploy concluídos com sucesso.'
    }
    failure {
      echo 'Falha no build ou deploy.'
    }
  }
}

