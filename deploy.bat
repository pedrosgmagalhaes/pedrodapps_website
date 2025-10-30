@echo off
echo 🚀 Iniciando deploy automatico...
echo.

REM Verificar se Node.js esta instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js nao encontrado. Instale o Node.js primeiro.
    pause
    exit /b 1
)

REM Executar o script de deploy
node scripts/deploy-all.cjs %*

echo.
echo ✅ Script concluido!
pause