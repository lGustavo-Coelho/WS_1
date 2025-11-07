# CONTINUAÇÃO FASE 3 - Guia Prático

## 🎯 Objetivo Imediato

Integrar ComponentsPage com o banco de dados real, seguindo o padrão estabelecido na FilamentsPage.

---

## 📋 Checklist de Validação

Antes de prosseguir com ComponentsPage, validar:

```bash
# 1. Type checking
npm run type-check
# Esperado: Sem erros (ou apenas avisos menores)

# 2. Linting
npm run lint
# Esperado: Código limpo ou ajustes menores

# 3. Testes
npm run test
# Esperado: 4+ testes passando

# 4. Build
npm run build
# Esperado: Build bem-sucedido

# 5. Rodar app
npm run dev
# Esperado: Electron window abre corretamente
```

---

## 🔄 Padrão para ComponentsPage v2

### 1. Estrutura Base
```typescript
// src/pages/ComponentsPage.tsx (NOVO v2 ou modificar)

import React, { useState, useEffect } from 'react';
import { Component } from '../types';
import { dataService } from '../services/dataService';
import { useAppStore } from '../store/appStore';
import { logger } from '../utils/logger';

const ComponentsPage: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const { setLoading, setError } = useAppStore();
  
  // 1. Carregar dados ao montar
  useEffect(() => {
    const loadComponents = async () => {
      setLoading(true);
      try {
        const data = await dataService.getComponents();
        setComponents(data);
        setError(null);
      } catch (err) {
        logger.error('Failed to load components', { error: err });
        setError('Erro ao carregar componentes');
      } finally {
        setLoading(false);
      }
    };
    
    if (components.length === 0) {
      loadComponents();
    }
  }, []);
  
  // 2. CRUD operations
  const handleCreate = async (data: Omit<Component, 'id'>) => {
    setLoading(true);
    try {
      const component = await dataService.createComponent(data);
      setComponents([...components, component]);
      setError(null);
    } catch (err) {
      logger.error('Failed to create component', { error: err });
      setError('Erro ao criar componente');
      alert('Erro ao salvar componente');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdate = async (id: string, data: Partial<Component>) => {
    setLoading(true);
    try {
      const updated = await dataService.updateComponent(id, data);
      setComponents(components.map(c => c.id === id ? updated! : c));
      setError(null);
    } catch (err) {
      logger.error('Failed to update component', { error: err });
      setError('Erro ao atualizar componente');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza?')) return;
    
    setLoading(true);
    try {
      await dataService.deleteComponent(id);
      setComponents(components.filter(c => c.id !== id));
      setError(null);
    } catch (err) {
      logger.error('Failed to delete component', { error: err });
      setError('Erro ao excluir componente');
      alert('Erro ao excluir componente');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {/* Modal de formulário */}
      {/* Tabela com dados */}
      {/* Ações (edit, delete) */}
    </div>
  );
};

export default ComponentsPage;
```

### 2. Campos do Componente
```typescript
// Schema para form
{
  id: 'COMP-1',
  name: 'Parafuso M3x8',
  category: 'Hardware',           // select dropdown
  stock: 200,                     // number input
  cost_per_unit: 0.15,            // currency input
  supplier?: 'Parafusos & Cia',   // text input
  purchase_date?: '2023-08-20',   // date input
  notes?: 'Descrição...',         // textarea
  created_at?: '...',
  updated_at?: '...'
}
```

### 3. Modal de Formulário
```typescript
interface ComponentFormModalProps {
  component: Component | null;
  onSave: (component: Component) => void;
  onClose: () => void;
}

const ComponentFormModal: React.FC<ComponentFormModalProps> = ({
  component,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<Omit<Component, 'id' | 'created_at' | 'updated_at'>>(
    component || {
      name: '',
      category: 'Hardware',
      stock: 0,
      cost_per_unit: 0,
      supplier: '',
      purchase_date: new Date().toISOString().split('T')[0],
      notes: ''
    }
  );
  
  // ... form logic (igual a FilamentsPage)
};
```

### 4. Tabela de Listagem
```typescript
// Colunas recomendadas:
// - Nome
// - Categoria
// - Estoque (units)
// - Custo/unit
// - Fornecedor
// - Data Compra
// - Ações (edit, delete)

{components.map(component => (
  <tr key={component.id}>
    <td>{component.name}</td>
    <td>{component.category}</td>
    <td>{component.stock}</td>
    <td>{formatCurrency(component.cost_per_unit)}</td>
    <td>{component.supplier || '-'}</td>
    <td>{component.purchase_date || '-'}</td>
    <td>
      <button onClick={() => openModal(component)}>Edit</button>
      <button onClick={() => handleDelete(component.id)}>Delete</button>
    </td>
  </tr>
))}
```

---

## 🚀 Checklist ComponentsPage

### Implementação
- [ ] Copiar FilamentsPage.tsx como referência
- [ ] Remover campos específicos de filamento
- [ ] Adicionar campos de componente
- [ ] Testar CRUD completo
- [ ] Validar DataService methods
- [ ] Testar validações de input

### Testes
- [ ] Adicionar novo componente
- [ ] Editar componente existente
- [ ] Excluir componente
- [ ] Verificar persistência no banco
- [ ] Testar filtros
- [ ] Validar formatação de valores

### Documentação
- [ ] Atualizar README se necessário
- [ ] Documentar padrão no FASE3_FUNCIONALIDADES.md
- [ ] Adicionar exemplos de uso

---

## 🧪 Padrão de Teste

### Teste Unitário para DataService
```typescript
import { dataService } from '../services/dataService';

describe('dataService - Components', () => {
  it('should create a new component', async () => {
    const component = await dataService.createComponent({
      name: 'Test Component',
      category: 'Hardware',
      stock: 100,
      cost_per_unit: 5.0,
    });
    
    expect(component.id).toBeDefined();
    expect(component.name).toBe('Test Component');
  });
  
  it('should get all components', async () => {
    const components = await dataService.getComponents();
    expect(Array.isArray(components)).toBe(true);
  });
  
  it('should update component', async () => {
    const updated = await dataService.updateComponent('COMP-1', {
      stock: 50
    });
    expect(updated?.stock).toBe(50);
  });
  
  it('should delete component', async () => {
    await dataService.deleteComponent('COMP-1');
    const components = await dataService.getComponents();
    expect(components.find(c => c.id === 'COMP-1')).toBeUndefined();
  });
});
```

---

## 🔌 Integração no App

### Em src/App.tsx
```typescript
import ComponentsPage from './pages/ComponentsPage';

// Adicionar no renderPage switch
case 'components': 
  return (
    <ComponentsPage 
      components={components} 
      setComponents={setComponents}
      setTransactions={setTransactions}
      settings={settings}
    />
  );
```

---

## 📊 Sequência de Desenvolvimento

### Dia 1-2: ComponentsPage
1. ✅ Criar ComponentsPage v2 seguindo padrão
2. ✅ Integrar com dataService
3. ✅ CRUD completo funcionando
4. ✅ Testes passando

### Dia 3-4: PrintersPage
1. Criar PrintersPage v2
2. Integrar com dataService
3. Adicionar métodos especializados (updateStatus, addPrintHours)
4. Testes

### Dia 5-6: PrintJobPage com Validação
1. Criar PrintJobPage com validação de estoque
2. Usar businessLogicService.validateStockForPrintJob()
3. Atualizar estoque após conclusão
4. Testes de integração

### Dia 7+: Relatórios & Orçamentos
1. OrçamentoPage com cálculos automáticos
2. Relatórios financeiros
3. Export CSV/PDF

---

## 💡 Dicas Importantes

### 1. Sempre Usar DataService
```typescript
// ✅ Correto - usando layer de integração
const data = await dataService.getComponents();

// ❌ Evitar - chamando repositório diretamente
const data = await componentRepository.findAll();
```

### 2. Sempre Usar Zustand Store
```typescript
// ✅ Correto
const { setLoading, setError } = useAppStore();

// ❌ Evitar - estado local sem sincronização
const [localLoading, setLocalLoading] = useState(false);
```

### 3. Sempre Logar Operações
```typescript
// ✅ Correto
logger.info('Component created', { id, name });
logger.error('Failed to create', { error, data });

// ❌ Evitar - sem logging
try { ... } catch (err) { }
```

### 4. Sempre Validar Input
```typescript
// ✅ Correto
if (!formData.name?.trim()) {
  alert('Name is required');
  return;
}

// ❌ Evitar - sem validação
onSave(formData);
```

### 5. Sempre Tratar Erros
```typescript
// ✅ Correto
try {
  const data = await dataService.getComponents();
  setError(null);
} catch (err) {
  logger.error('Failed', { error: err });
  setError('Erro ao carregar');
}

// ❌ Evitar - sem tratamento
const data = await dataService.getComponents();
```

---

## 📞 Suporte Rápido

### Erro: "Property does not exist on type"
→ Verificar types em `src/types/index.ts`  
→ Remover campos obsoletos (ex: `costPerUnit` → `cost_per_unit`)

### Erro: "dataService.getXyzs is not a function"
→ Adicionar método em `src/services/dataService.ts`  
→ Verificar nome do método (getComponents, getPrinters, etc)

### Erro: "Cannot find module 'dataService'"
→ Verificar import path: `'../services/dataService'`  
→ Verificar se arquivo existe

### App não carrega dados
→ Verificar se banco está criado: `npm run migrate`  
→ Verificar console para erros
→ Verificar se IPC API está respondendo

---

## 📚 Referências Existentes

- **FilamentsPage.tsx** - Exemplo completo integrado ✅
- **dataService.ts** - Todos os métodos base
- **businessLogicService.ts** - Cálculos
- **appStore.ts** - Estado global
- **types/index.ts** - Definições de tipos

---

## ✅ Definition of Done

Antes de marcar ComponentsPage como pronto:

- [ ] ✅ Type-check passa sem erros
- [ ] ✅ ESLint passa
- [ ] ✅ Testes passam
- [ ] ✅ CRUD funciona (create, read, update, delete)
- [ ] ✅ Dados persistem no banco
- [ ] ✅ Validações funcionam
- [ ] ✅ Loading states funcionam
- [ ] ✅ Error handling funciona
- [ ] ✅ Documentação atualizada
- [ ] ✅ Pronto para integração em App.tsx

---

**Boa sorte! 🚀**  
**Próximo destino: ComponentsPage v2**
