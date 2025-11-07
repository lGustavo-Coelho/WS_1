@echo off
REM Script de configuração inicial para 3D Management Desktop
REM Initial setup script for 3D Management Desktop

echo ========================================
echo 3D Management Desktop - Setup
echo ========================================
echo.

REM Check Node.js version
echo Verificando versão do Node.js...
echo Checking Node.js version...
node -v >nul 2>&1
if errorlevel 1 (
    echo X ERRO: Node.js não está instalado!
    echo X ERROR: Node.js is not installed!
    echo.
    echo Por favor, instale Node.js v18 ou superior:
    echo Please install Node.js v18 or higher:
    echo https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo OK Node.js %NODE_VERSION% detectado
echo OK Node.js %NODE_VERSION% detected
echo.

REM Check npm version
echo Verificando versão do npm...
echo Checking npm version...
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo OK npm %NPM_VERSION% detectado
echo OK npm %NPM_VERSION% detected
echo.

REM Install dependencies
echo ========================================
echo Passo 1: Instalando dependências...
echo Step 1: Installing dependencies...
echo ========================================
call npm install
if errorlevel 1 (
    echo X Erro ao instalar dependências!
    echo X Error installing dependencies!
    pause
    exit /b 1
)
echo.
echo OK Dependências instaladas com sucesso!
echo OK Dependencies installed successfully!
echo.

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo ========================================
    echo Passo 2: Criando arquivo .env.local...
    echo Step 2: Creating .env.local file...
    echo ========================================
    copy .env.example .env.local >nul
    echo OK Arquivo .env.local criado!
    echo OK .env.local file created!
    echo.
    echo i  Você pode editar .env.local para configurar:
    echo i  You can edit .env.local to configure:
    echo    - GEMINI_API_KEY ^(opcional / optional^)
    echo    - DB_PATH ^(opcional / optional^)
    echo.
) else (
    echo i  Arquivo .env.local já existe, pulando...
    echo i  .env.local file already exists, skipping...
    echo.
)

REM Run database migrations
echo ========================================
echo Passo 3: Inicializando banco de dados...
echo Step 3: Initializing database...
echo ========================================
call npm run migrate
if errorlevel 1 (
    echo X Erro ao inicializar banco de dados!
    echo X Error initializing database!
    pause
    exit /b 1
)
echo.
echo OK Banco de dados inicializado!
echo OK Database initialized!
echo.

REM Verify database was created
if exist "src\db\3d-management.sqlite" (
    echo OK Banco de dados criado: src\db\3d-management.sqlite
    echo OK Database created: src\db\3d-management.sqlite
    echo.
)

REM Success message
echo ========================================
echo OK CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!
echo OK SETUP COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Para executar o programa:
echo To run the program:
echo.
echo   npm run dev
echo.
echo Para gerar executável Windows:
echo To generate Windows executable:
echo.
echo   npm run build:win
echo.
echo Para mais informações, consulte:
echo For more information, see:
echo   - COMO_EXECUTAR.md ^(Português^)
echo   - README.md ^(English^)
echo.
echo ========================================
pause
