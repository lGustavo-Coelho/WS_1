# 🔧 Resolução de Problemas - 3D Management Desktop

Este guia ajuda a resolver os problemas mais comuns ao tentar executar o programa.

## 📋 Índice

- [Problema: Não consigo executar o programa](#problema-não-consigo-executar-o-programa)
- [Problema: Node.js não instalado](#problema-nodejs-não-instalado)
- [Problema: Dependências não instaladas](#problema-dependências-não-instaladas)
- [Problema: Banco de dados não inicializado](#problema-banco-de-dados-não-inicializado)
- [Problema: Porta já em uso](#problema-porta-já-em-uso)
- [Problema: Electron não abre](#problema-electron-não-abre)
- [Outros Problemas](#outros-problemas)

---

## ❌ Problema: Não consigo executar o programa

### Sintomas:
- Ao tentar executar `npm run dev`, recebo erros
- O programa não abre
- Mensagens de erro no terminal

### ✅ Solução Rápida - Use o script de configuração:

**Windows:**
```bash
# Clique duas vezes no arquivo ou execute:
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

Este script irá:
1. ✅ Verificar se Node.js está instalado
2. ✅ Instalar todas as dependências
3. ✅ Criar arquivo .env.local
4. ✅ Inicializar o banco de dados
5. ✅ Verificar que tudo está configurado corretamente

### ✅ Solução Manual:

Se o script de configuração não funcionar, siga estes passos manualmente:

```bash
# 1. Certifique-se de estar na pasta correta
cd 3d-management

# 2. Instale as dependências
npm install

# 3. Crie o arquivo de configuração
cp .env.example .env.local

# 4. Inicialize o banco de dados
npm run migrate

# 5. Execute o programa
npm run dev
```

---

## ❌ Problema: Node.js não instalado

### Sintomas:
```
'node' não é reconhecido como um comando interno
'node' is not recognized as an internal command
bash: node: command not found
```

### ✅ Solução:

1. **Baixe e instale Node.js:**
   - Acesse: https://nodejs.org/
   - Baixe a versão LTS (Long Term Support)
   - Execute o instalador
   - Siga as instruções na tela

2. **Verifique a instalação:**
   ```bash
   node --version
   npm --version
   ```
   
   Você deve ver algo como:
   ```
   v18.x.x
   10.x.x
   ```

3. **Se ainda não funcionar (Windows):**
   - Feche e reabra o Prompt de Comando
   - Ou reinicie o computador
   - Verifique se o Node.js está no PATH do sistema

---

## ❌ Problema: Dependências não instaladas

### Sintomas:
```
Error: Cannot find module 'electron'
Error: Cannot find module 'react'
Module not found
```

### ✅ Solução:

```bash
# Remova instalações anteriores problemáticas
rm -rf node_modules package-lock.json

# Windows:
# rmdir /s node_modules
# del package-lock.json

# Reinstale tudo
npm install
```

### Se continuar com erro:

```bash
# Limpe o cache do npm
npm cache clean --force

# Reinstale
npm install
```

---

## ❌ Problema: Banco de dados não inicializado

### Sintomas:
```
SQLITE_ERROR: no such table: filaments
Database file not found
Error connecting to database
```

### ✅ Solução:

```bash
# Execute as migrações do banco de dados
npm run migrate
```

### Verificar se o banco foi criado:

```bash
# Linux/Mac:
ls -lh src/db/3d-management.sqlite

# Windows:
dir src\db\3d-management.sqlite
```

Você deve ver um arquivo com aproximadamente 20KB.

### Se o arquivo não existir:

```bash
# Certifique-se de que o diretório existe
mkdir -p src/db   # Linux/Mac
md src\db         # Windows

# Execute as migrações novamente
npm run migrate
```

---

## ❌ Problema: Porta já em uso

### Sintomas:
```
Port 5173 is already in use
EADDRINUSE: address already in use
```

### ✅ Solução:

**Opção 1: Fechar o processo que usa a porta**

**Windows:**
```bash
# Encontrar o processo
netstat -ano | findstr :5173

# Matar o processo (substitua <PID> pelo número encontrado)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Encontrar e matar o processo
lsof -ti:5173 | xargs kill -9
```

**Opção 2: O Vite usa outra porta automaticamente**

Se você ver uma mensagem como:
```
Port 5173 is in use, trying another one...
Local: http://localhost:5174/
```

Isso é normal! O Vite escolheu automaticamente outra porta disponível.

---

## ❌ Problema: Electron não abre

### Sintomas:
- O comando `npm run dev` executa sem erros
- Mas a janela do Electron não abre
- Processo fica rodando mas nada acontece

### ✅ Solução:

1. **Verifique se há erros no console:**
   - Procure por mensagens de erro no terminal
   - Erros comuns: problemas de compilação TypeScript

2. **Verifique se os arquivos foram compilados:**
   ```bash
   ls -la dist-electron/
   ```
   
   Você deve ver:
   - `main.js` (grande, ~800KB)
   - `preload.js` (pequeno, ~1KB)

3. **Se os arquivos não existem, compile manualmente:**
   ```bash
   npm run type-check
   tsc -p tsconfig.json
   tsc -p tsconfig.node.json
   ```

4. **Tente executar novamente:**
   ```bash
   npm run dev
   ```

5. **Se ainda não funcionar (Linux):**
   ```bash
   # Instale dependências do sistema para Electron
   sudo apt-get update
   sudo apt-get install libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libdrm2 libgbm1 libxcb-dri3-0
   ```

---

## ❌ Problema: Erro de TypeScript

### Sintomas:
```
TS2307: Cannot find module 'X' or its corresponding type declarations
Type error: Property 'X' does not exist on type 'Y'
```

### ✅ Solução:

```bash
# Verifique erros de tipo
npm run type-check

# Se houver erros relacionados a dependências faltantes
npm install

# Reinstale as definições de tipo
npm install --save-dev @types/node @types/react @types/react-dom
```

---

## ❌ Problema: Windows Defender bloqueia o programa

### Sintomas:
- Ao tentar executar o `.exe`, recebe aviso do Windows Defender
- "O Windows protegeu seu PC"
- "Aplicativo não reconhecido"

### ✅ Solução:

**Isso é normal!** O aplicativo não tem assinatura digital (comum em desenvolvimento).

1. Clique em **"Mais informações"**
2. Clique em **"Executar mesmo assim"**
3. O programa será executado normalmente

**Para evitar isso no futuro:**
- O desenvolvedor pode assinar o aplicativo digitalmente
- Ou você pode adicionar uma exceção no Windows Defender

---

## ❌ Problema: Erro ao gerar executável (.exe)

### Sintomas:
```
Error: Cannot create executable
electron-builder error
```

### ✅ Solução:

```bash
# 1. Limpe builds anteriores
rm -rf release dist dist-electron

# Windows:
# rmdir /s release
# rmdir /s dist
# rmdir /s dist-electron

# 2. Certifique-se de que as dependências estão instaladas
npm install

# 3. Execute as migrações
npm run migrate

# 4. Tente gerar o .exe novamente
npm run build:win
```

### Se o erro persistir:

```bash
# Tente gerar sem empacotamento primeiro (para diagnóstico)
npm run build:dir

# Se isso funcionar, o problema é no empacotamento
# Verifique se tem espaço em disco suficiente
```

---

## 🔍 Outros Problemas

### Problema: Erro de permissão (Linux/Mac)

```bash
# Se receber erro de permissão ao executar scripts:
chmod +x setup.sh
chmod +x start-3d-management-dev.sh  # se existir

# Para o npm:
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) ./node_modules
```

### Problema: Cache corrompido do npm

```bash
# Limpe o cache
npm cache clean --force

# Remova node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Problema: Versão errada do Node.js

```bash
# Verifique a versão atual
node --version

# Se for menor que v18, atualize
# Recomendado: use nvm (Node Version Manager)

# Linux/Mac:
nvm install 18
nvm use 18

# Windows: baixe o instalador em nodejs.org
```

### Problema: Memória insuficiente

Se o build falhar com erro de memória:

```bash
# Aumentar limite de memória do Node.js
export NODE_OPTIONS="--max-old-space-size=4096"

# Windows:
set NODE_OPTIONS=--max-old-space-size=4096

# Depois execute o build novamente
npm run build:win
```

---

## 📞 Suporte Adicional

Se nenhuma destas soluções resolver seu problema:

1. **Colete informações:**
   ```bash
   node --version
   npm --version
   npm list electron
   ```

2. **Verifique os logs de erro completos:**
   - Copie a mensagem de erro completa do terminal
   - Inclua o sistema operacional que está usando

3. **Canais de suporte:**
   - Abra uma issue no GitHub do projeto
   - Entre em contato com a equipe de desenvolvimento
   - Consulte a documentação em:
     - `README.md`
     - `COMO_EXECUTAR.md`

---

## ✅ Checklist de Verificação Rápida

Antes de pedir ajuda, verifique:

- [ ] Node.js v18+ está instalado (`node --version`)
- [ ] npm está instalado (`npm --version`)
- [ ] Estou na pasta `3d-management`
- [ ] Executei `npm install` com sucesso
- [ ] Arquivo `node_modules/` existe
- [ ] Executei `npm run migrate` com sucesso
- [ ] Arquivo `src/db/3d-management.sqlite` existe
- [ ] Não há erros ao executar `npm run type-check`
- [ ] Não há erros ao executar `npm run lint`

Se todos os itens estão marcados e ainda assim não funciona, descreva:
- Sistema operacional (Windows 10/11, Linux, Mac)
- Versão do Node.js
- Mensagem de erro completa
- O que você estava tentando fazer

---

**Última atualização:** Novembro 2024  
**Versão:** 1.0.0
