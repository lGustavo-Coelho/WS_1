# ⚡ Quick Start - Fase 3

**Para pessoas ocupadas que querem começar rápido.**

---

## 🎯 Em 2 Minutos

```
✅ FASE 3 = 70% COMPLETO

✨ O que existe:
   - appStore.ts (estado global)
   - dataService.ts (banco + logging)
   - businessLogicService.ts (cálculos)
   - FilamentsPage.tsx (exemplo pronto)

🚧 O que falta:
   - ComponentsPage v2 (5 imports para corrigir)
   - PrintersPage v2 (copiar padrão)
   - PrintJobPage (validação)

👉 Próximo: Corrigir ComponentsPage v2 em 15 min
```

---

## ⚙️ Setup (1 min)

```bash
cd d:\WS_1\3d-management

npm run type-check    # Validar tipos
npm run build         # Build
npm run dev          # Rodar app
```

---

## 📖 Leia Isto (5 min)

1. **INDICE_DOCUMENTACAO_FASE3.md** - Índice e navegação
2. **GUIA_CONTINUACAO_FASE3.md** - Padrão + exemplos

---

## 📝 Exemplo: Criar Novo CRUD em 1 Hora

### 1. DataService (5 min)
```typescript
// Adicionar em src/services/dataService.ts
async createXyz(data: Omit<Xyz, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const xyz = await xyzRepository.create(data as any);
    logger.info('Xyz created', { id: (xyz as any).id });
    return xyz;
  } catch (error) {
    logger.error('Failed to create xyz', { error });
    throw error;
  }
}

async updateXyz(id: string, data: Partial<Xyz>) {
  try {
    await xyzRepository.update(id, data as any);
    const updated = await xyzRepository.findById(id);
    logger.info('Xyz updated', { id });
    return updated;
  } catch (error) {
    logger.error('Failed to update xyz', { error });
    throw error;
  }
}

// ... delete + get similar
```

### 2. Page Component (45 min)
Copiar **FilamentsPage.tsx** e:
- Renomear `Filament` → `Xyz`
- Atualizar campos do form
- Atualizar chamadas de dataService
- Testar CRUD

### 3. Integração (10 min)
```typescript
// Em App.tsx
import XyzPage from './pages/XyzPage';

case 'xyz': return <XyzPage ... />;
```

---

## 🧪 Testar (5 min)

```bash
npm run dev
# 1. Navegar para página
# 2. Adicionar item
# 3. Editar item
# 4. Deletar item
# 5. Verificar no banco (SQLite)
```

---

## 🐛 Problemas Comuns

| Problema | Solução |
|----------|---------|
| Build falha | `npm run type-check` → remover imports não usados |
| Dados não carregam | `npm run migrate` → db não criado |
| Componente em branco | Verificar console (F12) → erro de fetch |
| Type error | Verificar tipos em `src/types/index.ts` |

---

## 📚 Referências

| Arquivo | Uso |
|---------|-----|
| FilamentsPage.tsx | ⭐ Exemplo completo |
| dataService.ts | Métodos base |
| appStore.ts | Estado global |
| GUIA_CONTINUACAO_FASE3.md | Detalhes |

---

## ✅ Checklist Mini

- [ ] Ler INDICE_DOCUMENTACAO_FASE3.md (3 min)
- [ ] Corrigir ComponentsPage v2 (5 min)
- [ ] Rodar npm run build (5 min)
- [ ] Testar no app (10 min)
- [ ] Começar PrintersPage (próxima tarefa)

---

## 🚀 Go!

```bash
npm run dev
# Navegar para páginas e testar

# Depois:
npm run type-check && npm run build
```

---

**Status:** ✅ PRONTO PARA COMEÇAR  
**Tempo:** <2 horas para novo CRUD  
**Padrão:** Replicável para qualquer entidade  
**Suporte:** Ver GUIA_CONTINUACAO_FASE3.md
