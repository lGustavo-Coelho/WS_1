# 🚀 Como Executar o 3D Management Desktop

Este guia explica passo a passo como executar o programa 3D Management Desktop em seu computador.

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Executando o Programa](#executando-o-programa)
- [Opções de Execução](#opções-de-execução)
- [Solução de Problemas](#solução-de-problemas)
- [Comandos Úteis](#comandos-úteis)

---

## 📦 Pré-requisitos

Antes de executar o programa, você precisa ter instalado em seu computador:

### 1. Node.js (versão 18 ou superior)

**Windows:**
1. Acesse: https://nodejs.org/
2. Baixe a versão LTS (recomendada)
3. Execute o instalador e siga as instruções
4. Para verificar se instalou corretamente, abra o Prompt de Comando e digite:
   ```bash
   node --version
   npm --version
   ```

**Linux/Mac:**
```bash
# Usando nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Verificar instalação
node --version
npm --version
```

---

## 🔧 Instalação

### Passo 1: Obter o código do projeto

```bash
# Se você ainda não tem o projeto, clone o repositório:
git clone https://github.com/lGustavo-Coelho/WS_1.git
cd WS_1/3d-management
```

### Passo 2: Instalar dependências

```bash
npm install
```

⏱️ Este processo pode levar alguns minutos na primeira vez.

### Passo 3: Configurar variáveis de ambiente (opcional)

```bash
# Copiar o arquivo de exemplo
cp .env.example .env.local

# Editar o arquivo .env.local (se necessário)
# - Configurar GEMINI_API_KEY se quiser usar recursos de IA
# - Ajustar DB_PATH se quiser mudar o local do banco de dados
```

### Passo 4: Inicializar o banco de dados

```bash
npm run migrate
```

✅ Isso cria o banco de dados SQLite e todas as tabelas necessárias.

---

## ▶️ Executando o Programa

### Opção 1: Executável Windows (.exe) - RECOMENDADO PARA USUÁRIOS

**Esta é a maneira mais fácil para usuários que apenas querem usar o programa!**

#### Como Gerar o Executável (.exe)

```bash
# 1. Instalar dependências (apenas na primeira vez)
npm install

# 2. Executar as migrações do banco de dados (apenas na primeira vez)
npm run migrate

# 3. Gerar o executável Windows
npm run build:win
```

⏱️ O processo de build pode levar 5-10 minutos na primeira vez.

✅ Após a conclusão, o instalador será gerado em: `release/3D Management Desktop-1.0.0-Setup.exe`

#### Como Instalar e Usar o .exe

1. **Navegue até a pasta de saída:**
   ```
   release/3D Management Desktop-1.0.0-Setup.exe
   ```

2. **Execute o instalador:**
   - Clique duas vezes no arquivo `.exe`
   - Siga o assistente de instalação
   - Escolha o diretório de instalação (ou use o padrão)
   - O instalador criará atalhos na Área de Trabalho e no Menu Iniciar

3. **Execute o programa:**
   - Use o atalho na Área de Trabalho, OU
   - Procure por "3D Management Desktop" no Menu Iniciar
   - Clique para abrir

**✨ Pronto! Agora você pode usar o programa sem precisar do Node.js ou linha de comando!**

---

### Opção 2: Modo Desenvolvimento (Para desenvolvedores)

```bash
npm run dev
```

Isso irá:
1. Iniciar o servidor de desenvolvimento
2. Abrir automaticamente a aplicação Electron
3. Habilitar hot-reload (recarrega automaticamente quando você faz alterações)

### Opção 3: Usando o Script Windows (apenas Windows)

Se você estiver no Windows, pode usar o arquivo `.bat` incluído:

```bash
# Clique duas vezes no arquivo:
start-3d-management-dev.bat

# Ou execute via linha de comando:
.\start-3d-management-dev.bat
```

### Opção 4: Modo Produção (Sem instalador)

Para executar a versão otimizada sem criar o .exe:

```bash
# 1. Compilar o projeto
npm run build:dir

# 2. O aplicativo compilado estará em release/win-unpacked/
# Execute o arquivo .exe dentro dessa pasta
```

---

## 🎯 Qual Opção Escolher?

### Para Usuários Finais (Apenas usar o programa)

**✅ Use a Opção 1: Executável Windows (.exe)**

- Não precisa instalar Node.js
- Não precisa usar linha de comando
- Instalação simples como qualquer programa Windows
- Atalhos automáticos na Área de Trabalho
- Atualizações futuras podem ser instaladas facilmente

**Passos:**
1. Peça ao desenvolvedor para gerar o `.exe` (ou gere você mesmo seguindo a Opção 1)
2. Execute o instalador `3D Management Desktop-1.0.0-Setup.exe`
3. Use o atalho criado na Área de Trabalho

### Para Desenvolvedores (Modificar/testar o programa)

**✅ Use a Opção 2: Modo Desenvolvimento**

- Ideal para fazer alterações no código
- Hot-reload automático
- Ferramentas de desenvolvimento ativas
- Acesso ao console de erros

**Passos:**
1. Instale Node.js e dependências
2. Execute `npm run dev`
3. Faça suas modificações
4. Teste em tempo real

**Comandos úteis para desenvolvedores:**

```bash
# Modo watch - recarrega automaticamente
npm run dev

# Verificar tipos TypeScript
npm run type-check

# Executar testes
npm run test

# Verificar código (lint)
npm run lint

# Gerar executável para distribuir
npm run build:win
```
```

---

## 🔍 O Que Acontece ao Executar?

Quando você executa `npm run dev`:

1. ⚙️ **Vite** inicia o servidor de desenvolvimento
2. 🗄️ **SQLite** conecta ao banco de dados local
3. ⚛️ **React** renderiza a interface do usuário
4. 🖥️ **Electron** abre a janela da aplicação

Você verá:
- Dashboard com métricas em tempo real
- Menu lateral com opções de navegação
- Páginas para gerenciar:
  - Filamentos
  - Componentes
  - Impressoras
  - Orçamentos
  - Vendas
  - Investimentos

---

## 🐛 Solução de Problemas

### Problema: Erro ao gerar o .exe (electron-builder)
**Solução:**
```bash
# 1. Certifique-se de que todas as dependências estão instaladas
npm install

# 2. Limpe builds anteriores
rm -rf release dist dist-electron

# 3. Tente gerar novamente
npm run build:win

# 4. Se o erro persistir, tente o build sem empacotamento primeiro
npm run build:dir
```

### Problema: "O aplicativo não pode ser executado neste computador"
**Solução:** O .exe foi compilado para Windows 64-bit. Certifique-se de que está usando Windows 64-bit.

### Problema: Windows Defender bloqueia o instalador
**Solução:**
1. Clique em "Mais informações"
2. Clique em "Executar mesmo assim"
3. Isso acontece porque o aplicativo não tem assinatura digital (normal para aplicações em desenvolvimento)

### Problema: "npm: command not found"
**Solução:** Node.js não está instalado. Volte para [Pré-requisitos](#pré-requisitos).

### Problema: "Cannot find module..."
**Solução:** 
```bash
# Remova node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Problema: Banco de dados não encontrado
**Solução:**
```bash
npm run migrate
```

### Problema: Porta já em uso
**Solução:**
```bash
# O Vite tentará usar outra porta automaticamente
# Ou você pode matar o processo usando a porta:

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5173 | xargs kill -9
```

### Problema: Aplicação não abre (modo dev)
**Solução:**
```bash
# 1. Verificar se há erros no terminal
# 2. Limpar cache e recompilar:
npm run clean  # se disponível
npm run build
npm run dev
```

### Problema: Erro de permissão ao executar scripts (Linux/Mac)
**Solução:**
```bash
# Se você criou scripts personalizados, pode ser necessário dar permissão:
chmod +x nome-do-script.sh

# O arquivo .bat é apenas para Windows e não precisa de chmod
```

---

## 📚 Comandos Úteis

### Verificação e Validação

```bash
# Verificar tipos TypeScript
npm run type-check

# Verificar formatação de código
npm run format:check

# Corrigir formatação automaticamente
npm run format

# Executar lint (análise de código)
npm run lint

# Corrigir problemas de lint automaticamente
npm run lint:fix

# Executar todas as verificações
npm run validate
```

### Testes

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch (contínuo)
npm run test:watch

# Abrir interface visual dos testes
npm run test:ui

# Gerar relatório de cobertura
npm run test:coverage
```

### Banco de Dados

```bash
# Executar migrações
npm run migrate

# Localização do banco de dados:
# ./src/db/3d-management.sqlite
```

### Build e Deploy

```bash
# Gerar executável Windows (.exe) - RECOMENDADO
npm run build:win

# Gerar build sem empacotamento (pasta com arquivos)
npm run build:dir

# Compilar para produção (todas as plataformas configuradas)
npm run build

# Preview da build de produção
npm run preview
```

**Localização dos arquivos gerados:**
- Instalador Windows: `release/3D Management Desktop-1.0.0-Setup.exe`
- Aplicativo desempacotado: `release/win-unpacked/`

---

## 🎓 Próximos Passos

Após executar o programa com sucesso:

1. **Explore as funcionalidades**: Navegue pelas diferentes páginas
2. **Leia a documentação**: Consulte `README.md` para mais detalhes
3. **Verifique os guias de desenvolvimento**:
   - `QUICK_START_FASE3.md` - Início rápido
   - `GUIA_CONTINUACAO_FASE3.md` - Guia de continuação
   - `INDICE_DOCUMENTACAO_FASE3.md` - Índice da documentação

---

## 📞 Suporte

Se encontrar problemas não cobertos neste guia:

1. Verifique o terminal por mensagens de erro
2. Consulte a [seção de problemas](#solução-de-problemas)
3. Abra uma issue no repositório do GitHub
4. Entre em contato com a equipe de desenvolvimento

---

## ✅ Checklist Rápido

### Para Usuários (Quero apenas usar):

- [ ] Conseguir o arquivo `3D Management Desktop-1.0.0-Setup.exe`
- [ ] Executar o instalador
- [ ] Seguir o assistente de instalação
- [ ] Usar o atalho na Área de Trabalho
- [ ] Aplicação aberta com sucesso! 🎉

### Para Desenvolvedores (Quero desenvolver):

- [ ] Node.js instalado (v18+)
- [ ] Código do projeto baixado
- [ ] `npm install` executado
- [ ] `.env.local` configurado (opcional)
- [ ] `npm run migrate` executado
- [ ] `npm run dev` executado
- [ ] Aplicação aberta com sucesso! 🎉

---

## 📝 Resumo Rápido (TL;DR)

### Para Usuários (Gerar .exe):
```bash
# Instalação única:
npm install
npm run migrate

# Gerar executável Windows:
npm run build:win

# O instalador estará em: release/3D Management Desktop-1.0.0-Setup.exe
```

### Para Desenvolvedores (Modo dev):
```bash
# Instalação única:
npm install
npm run migrate

# Executar sempre que quiser usar:
npm run dev
```

**Pronto!** A aplicação deve abrir automaticamente. 🚀

---

**Última atualização:** Novembro 2024  
**Versão:** 1.0.0  
**Licença:** MIT
