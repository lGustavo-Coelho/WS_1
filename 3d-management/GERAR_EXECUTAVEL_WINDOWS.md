# 🪟 Como Gerar Executável Windows (.exe)

**Guia rápido para criar um instalador Windows do 3D Management Desktop**

---

## ⚡ Processo Rápido

```bash
# 1. Instalar dependências (apenas na primeira vez)
npm install

# 2. Executar migrações (apenas na primeira vez)
npm run migrate

# 3. Gerar o executável Windows
npm run build:win
```

⏱️ **Tempo estimado:** 5-10 minutos (primeira vez)

✅ **Resultado:** `release/3D Management Desktop-1.0.0-Setup.exe`

---

## 📋 Pré-requisitos

Antes de gerar o executável, você precisa ter:

- ✅ Windows (recomendado para gerar .exe para Windows)
- ✅ Node.js versão 18 ou superior
- ✅ npm (instalado automaticamente com Node.js)
- ✅ Código fonte do projeto

---

## 🔧 Passo a Passo Detalhado

### 1️⃣ Preparar o Ambiente (Primeira vez apenas)

```bash
# Navegar até a pasta do projeto
cd caminho/para/3d-management

# Instalar todas as dependências
npm install
```

### 2️⃣ Configurar Banco de Dados (Primeira vez apenas)

```bash
# Executar migrações do banco de dados
npm run migrate
```

### 3️⃣ Gerar o Executável

```bash
# Gerar instalador Windows com NSIS
npm run build:win
```

**O que acontece durante o build:**
1. ⚙️ TypeScript compila o código
2. 📦 Vite empacota os arquivos da aplicação
3. 🖥️ Electron prepara o runtime
4. 📝 electron-builder cria o instalador NSIS
5. ✅ Arquivo .exe gerado na pasta `release/`

### 4️⃣ Localizar o Executável

Após a conclusão (5-10 minutos), o instalador estará em:

```
release/3D Management Desktop-1.0.0-Setup.exe
```

---

## 📦 O Que Foi Gerado?

### Instalador NSIS (Setup.exe)
- **Arquivo:** `3D Management Desktop-1.0.0-Setup.exe`
- **Tamanho:** ~100-200 MB (inclui Node.js e todas as dependências)
- **Tipo:** Instalador completo para Windows
- **Funcionalidades:**
  - ✅ Assistente de instalação
  - ✅ Escolha do diretório de instalação
  - ✅ Cria atalhos (Área de Trabalho + Menu Iniciar)
  - ✅ Adiciona ao Painel de Controle (desinstalar)
  - ✅ Não requer Node.js instalado no computador do usuário

---

## 🚀 Como Distribuir o Executável

### Opção 1: Compartilhar Arquivo Diretamente
1. Navegue até `release/3D Management Desktop-1.0.0-Setup.exe`
2. Copie o arquivo
3. Compartilhe via:
   - Pen drive
   - Email (se o tamanho permitir)
   - Armazenamento em nuvem (Google Drive, Dropbox, etc.)
   - Rede local

### Opção 2: Hospedar Online
1. Faça upload do `.exe` para um servidor ou serviço de hospedagem
2. Compartilhe o link de download
3. Usuários baixam e executam

---

## 💻 Como o Usuário Final Instala

1. **Baixar/Obter** o arquivo `3D Management Desktop-1.0.0-Setup.exe`

2. **Executar** o instalador (duplo clique)

3. **Windows Defender** pode mostrar aviso (normal para apps não assinados):
   - Clique em "Mais informações"
   - Clique em "Executar mesmo assim"

4. **Seguir o assistente**:
   - Aceitar termos
   - Escolher pasta de instalação
   - Aguardar instalação

5. **Pronto!** Usar o atalho criado na Área de Trabalho

---

## 🛠️ Comandos Alternativos

### Gerar Sem Instalador (Pasta com arquivos)
```bash
npm run build:dir
```
Resultado: `release/win-unpacked/` - Pasta com o aplicativo executável

### Gerar para Todas as Plataformas
```bash
npm run build
```
Gera builds conforme configuração (Windows, Mac, Linux)

---

## 🐛 Problemas Comuns

### ❌ Erro: "Cannot find module"
```bash
# Solução: Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
npm run build:win
```

### ❌ Erro: "tsc: command not found"
```bash
# Solução: TypeScript não está instalado
npm install
```

### ❌ Build muito lento
- **Normal na primeira vez** (5-10 minutos)
- Builds subsequentes são mais rápidos (~2-3 minutos)
- electron-builder baixa dependências do Electron na primeira vez

### ❌ Pasta release/ não foi criada
```bash
# Verificar se há erros no terminal
# Limpar builds anteriores e tentar novamente
rm -rf dist dist-electron release
npm run build:win
```

### ❌ Windows Defender bloqueia o arquivo
- **Isso é normal** para aplicativos não assinados
- Para resolver permanentemente: adquirir certificado de assinatura de código
- Para usar mesmo assim: "Mais informações" → "Executar mesmo assim"

---

## 📊 Especificações do Executável

| Propriedade | Valor |
|-------------|-------|
| **Nome do Produto** | 3D Management Desktop |
| **Versão** | 1.0.0 |
| **Arquitetura** | Windows x64 (64-bit) |
| **Tipo de Instalador** | NSIS |
| **Instalação** | Customizável |
| **Atalhos** | Área de Trabalho + Menu Iniciar |
| **Desinstalação** | Via Painel de Controle |

---

## 🎯 Próximos Passos

Após gerar o executável:

1. ✅ **Testar** em um computador limpo (sem Node.js)
2. ✅ **Verificar** se todas as funcionalidades funcionam
3. ✅ **Documentar** processo de instalação para usuários
4. ✅ **Distribuir** para os usuários finais

---

## 📞 Suporte

**Problemas ao gerar o executável?**

1. Verifique o terminal por mensagens de erro específicas
2. Consulte a seção de [Problemas Comuns](#problemas-comuns)
3. Veja o guia completo: [COMO_EXECUTAR.md](./COMO_EXECUTAR.md)

---

## 📝 Resumo Ultra-Rápido

```bash
npm install && npm run migrate && npm run build:win
```

**Aguarde 5-10 minutos...**

**Executável pronto em:** `release/3D Management Desktop-1.0.0-Setup.exe` ✅

---

**Última atualização:** Novembro 2024  
**Versão:** 1.0.0
