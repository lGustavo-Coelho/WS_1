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

### Modo Desenvolvimento (Recomendado para testes)

```bash
npm run dev
```

Isso irá:
1. Iniciar o servidor de desenvolvimento
2. Abrir automaticamente a aplicação Electron
3. Habilitar hot-reload (recarrega automaticamente quando você faz alterações)

### Usando o Script Windows (apenas Windows)

Se você estiver no Windows, pode usar o arquivo `.bat` incluído:

```bash
# Clique duas vezes no arquivo:
start-3d-management-dev.bat

# Ou execute via linha de comando:
.\start-3d-management-dev.bat
```

### Modo Produção

Para executar a versão otimizada para produção:

```bash
# 1. Compilar o projeto
npm run build

# 2. Executar a versão compilada
npm run preview
```

---

## 🎯 Opções de Execução

### Para Usuários Finais

Se você apenas quer **usar** o programa (não desenvolver):

1. Peça ao desenvolvedor para gerar um executável
2. O desenvolvedor executará: `npm run build`
3. O executável estará em `dist-electron/`
4. Instale e execute como qualquer outro programa

### Para Desenvolvedores

Se você quer **modificar** o programa:

```bash
# Modo watch - recarrega automaticamente
npm run dev

# Verificar tipos TypeScript
npm run type-check

# Executar testes
npm run test

# Verificar código (lint)
npm run lint
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

### Problema: Aplicação não abre
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
# Compilar para produção
npm run build

# Preview da build de produção
npm run preview
```

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

Para executar pela primeira vez:

- [ ] Node.js instalado (v18+)
- [ ] Código do projeto baixado
- [ ] `npm install` executado
- [ ] `.env.local` configurado (opcional)
- [ ] `npm run migrate` executado
- [ ] `npm run dev` executado
- [ ] Aplicação aberta com sucesso! 🎉

---

## 📝 Resumo Rápido (TL;DR)

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
