import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Component, Transaction, Settings } from '../types';
import { PlusIcon, PlusCircleIcon, EditIcon, TrashIcon, WrenchIcon } from '../components/Icons';
import { dataService } from '../services/dataService';
import { useAppStore } from '../store/appStore';
import { logger } from '../utils/logger';

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: 'UTC',
};

const formatDateInput = (value?: string) => {
  if (!value) {
    return new Date().toISOString().split('T')[0];
  }
  return value.split('T')[0];
};

interface ComponentFormModalProps {
  component: Component | null;
  onSave: (component: Component) => Promise<void>;
  onClose: () => void;
}

const ComponentFormModal: React.FC<ComponentFormModalProps> = ({ component, onSave, onClose }) => {
  const buildInitialState = useCallback(() => ({
    name: component?.name ?? '',
    category: component?.category ?? 'Hardware',
    stock: component?.stock ?? 0,
    cost_per_unit: component?.cost_per_unit ?? 0,
    supplier: component?.supplier ?? '',
    purchase_date: formatDateInput(component?.purchase_date),
    notes: component?.notes ?? '',
  }), [component]);

  const [formData, setFormData] = useState<Omit<Component, 'id' | 'created_at' | 'updated_at'>>(buildInitialState);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(buildInitialState());
  }, [component?.id, buildInitialState]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => {
      if (name === 'stock' || name === 'cost_per_unit') {
        return { ...previous, [name]: Number(value) || 0 };
      }
      return { ...previous, [name]: value } as typeof previous;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const componentToSave: Component = {
        id: component?.id ?? `COMP-${Date.now()}`,
        ...formData,
        purchase_date: formData.purchase_date || undefined,
      };

      await onSave(componentToSave);
    } catch (error) {
      logger.error('Failed to submit component form', { error });
      alert('Erro ao salvar componente');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 w-full max-w-md" onClick={(event) => event.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-100 mb-6">{component ? 'Editar Componente' : 'Adicionar Componente'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Nome do Componente</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Parafuso M3x8"
              className="mt-1 w-full"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Categoria</label>
              <select name="category" value={formData.category} onChange={handleChange} className="mt-1 w-full">
                <option value="Hardware">Hardware</option>
                <option value="Eletrônico">Eletrônico</option>
                <option value="Acessório">Acessório</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Estoque</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="mt-1 w-full" min={0} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Custo por Unidade (R$)</label>
              <input
                type="number"
                step="0.01"
                name="cost_per_unit"
                value={formData.cost_per_unit}
                onChange={handleChange}
                className="mt-1 w-full"
                min={0}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Fornecedor</label>
              <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} className="mt-1 w-full" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Data da Compra</label>
            <input type="date" name="purchase_date" value={formData.purchase_date || ''} onChange={handleChange} className="mt-1 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Notas</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Observações..." className="mt-1 w-full h-20" />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold rounded-md transition" disabled={isSaving}>
              Cancelar
            </button>
            <button type="submit" className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition disabled:opacity-50" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ComponentPurchaseModalProps {
  components: Component[];
  onSave: (data: { componentId: string; quantity: number; costPerUnit: number; purchaseDate: string }) => Promise<void>;
  onClose: () => void;
}

const ComponentPurchaseModal: React.FC<ComponentPurchaseModalProps> = ({ components, onSave, onClose }) => {
  const [componentId, setComponentId] = useState<string>(components[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [costPerUnit, setCostPerUnit] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!componentId) {
      alert('Selecione um componente antes de registrar a compra.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({ componentId, quantity, costPerUnit, purchaseDate });
    } catch (error) {
      logger.error('Failed to register component purchase', { error });
      alert('Erro ao registrar compra');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 w-full max-w-md" onClick={(event) => event.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Registrar Compra de Componente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Componente</label>
            <select value={componentId} onChange={(event) => setComponentId(event.target.value)} className="mt-1 w-full" required>
              <option value="">Selecione um componente...</option>
              {components.map((component) => (
                <option key={component.id} value={component.id}>
                  {component.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Quantidade Comprada</label>
              <input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value) || 0)} className="mt-1 w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Custo por Unidade (R$)</label>
              <input type="number" min={0} step="0.01" value={costPerUnit} onChange={(event) => setCostPerUnit(Number(event.target.value) || 0)} className="mt-1 w-full" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Data da Compra</label>
            <input type="date" value={purchaseDate} onChange={(event) => setPurchaseDate(event.target.value)} className="mt-1 w-full" required />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold rounded-md transition" disabled={isSaving}>
              Cancelar
            </button>
            <button type="submit" className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition disabled:opacity-50" disabled={isSaving}>
              {isSaving ? 'Registrando...' : 'Registrar Compra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ComponentsPageProps {
  components: Component[];
  setComponents: React.Dispatch<React.SetStateAction<Component[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  settings: Settings;
}

const ComponentsPage: React.FC<ComponentsPageProps> = ({ components, setComponents, setTransactions, settings }) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [nameFilter, setNameFilter] = useState('');
  const { setLoading, setError } = useAppStore();

  useEffect(() => {
    const loadComponents = async () => {
      setLoading(true);
      try {
        const data = await dataService.getComponents();
        setComponents(data);
        setError(null);
      } catch (error) {
        logger.error('Failed to load components', { error });
        setError('Erro ao carregar componentes');
      } finally {
        setLoading(false);
      }
    };

    if (components.length === 0) {
      loadComponents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredComponents = useMemo(
    () =>
      components.filter((component) =>
        nameFilter ? component.name.toLowerCase().includes(nameFilter.toLowerCase()) : true
      ),
    [components, nameFilter]
  );

  const handleSaveComponent = async (component: Component) => {
    setLoading(true);
    try {
      if (editingComponent) {
        const updated = await dataService.updateComponent(component.id, component);
        setComponents((previous) => previous.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await dataService.createComponent(component);
        setComponents((previous) => [...previous, created]);
      }

      setError(null);
      setIsFormModalOpen(false);
      setEditingComponent(null);
    } catch (error) {
      logger.error('Failed to persist component', { error });
      setError('Erro ao salvar componente');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComponent = async (componentId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este componente?')) {
      return;
    }

    setLoading(true);
    try {
      await dataService.deleteComponent(componentId);
      setComponents((previous) => previous.filter((component) => component.id !== componentId));
      setError(null);
    } catch (error) {
      logger.error('Failed to delete component', { error });
      setError('Erro ao excluir componente');
      alert('Erro ao excluir componente');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPurchase = async (data: { componentId: string; quantity: number; costPerUnit: number; purchaseDate: string }) => {
    setLoading(true);
    try {
      const selected = components.find((component) => component.id === data.componentId);

      if (!selected) {
        throw new Error('Component not found for purchase');
      }

      const updated = await dataService.updateComponent(data.componentId, {
        stock: selected.stock + data.quantity,
        cost_per_unit: data.costPerUnit,
        purchase_date: data.purchaseDate,
      });

      setComponents((previous) => previous.map((component) => (component.id === updated.id ? updated : component)));

      const totalCost = data.quantity * data.costPerUnit;
      const transaction: Transaction = {
        id: `TRN-COMP-${Date.now()}`,
        date: new Date(data.purchaseDate).toISOString(),
        description: `Compra de componente: ${updated.name} (x${data.quantity})`,
        amount: totalCost,
        type: 'expense',
        category: 'Compra de Suprimento',
      };

      setTransactions((previous) => [transaction, ...previous]);
      setError(null);
      setIsPurchaseModalOpen(false);
    } catch (error) {
      logger.error('Failed to register component purchase', { error });
      setError('Erro ao registrar compra de componente');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const openFormModal = (component: Component | null = null) => {
    setEditingComponent(component);
    setIsFormModalOpen(true);
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: settings.currency }).format(value);
  const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString('pt-BR', DATE_FORMAT_OPTIONS) : '—');

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Filtrar por nome..."
          value={nameFilter}
          onChange={(event) => setNameFilter(event.target.value)}
          className="w-full md:w-64"
        />
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => setIsPurchaseModalOpen(true)}
            className="flex-1 md:flex-initial w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Registrar Compra
          </button>
          <button
            onClick={() => openFormModal()}
            className="flex-1 md:flex-initial w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Componente
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-700/50 text-sm text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-6 font-medium">Nome</th>
              <th className="py-3 px-6 font-medium">Categoria</th>
              <th className="py-3 px-6 font-medium">Estoque</th>
              <th className="py-3 px-6 font-medium">Custo Unitário</th>
              <th className="py-3 px-6 font-medium">Fornecedor</th>
              <th className="py-3 px-6 font-medium">Última Compra</th>
              <th className="py-3 px-6 font-medium">Notas</th>
              <th className="py-3 px-6 font-medium text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {filteredComponents.length > 0 ? (
              filteredComponents.map((component) => (
                <tr key={component.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-4 px-6 font-medium text-gray-100">{component.name}</td>
                  <td className="py-4 px-6">{component.category}</td>
                  <td className="py-4 px-6 font-semibold">{component.stock}</td>
                  <td className="py-4 px-6">{formatCurrency(component.cost_per_unit)}</td>
                  <td className="py-4 px-6">{component.supplier ?? '—'}</td>
                  <td className="py-4 px-6">{formatDate(component.purchase_date)}</td>
                  <td className="py-4 px-6">{component.notes ?? '—'}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-3">
                      <button onClick={() => openFormModal(component)} className="text-blue-400 hover:text-blue-300">
                        <EditIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDeleteComponent(component.id)} className="text-red-400 hover:text-red-300">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-20 text-gray-500">
                  <WrenchIcon className="h-16 w-16 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">Nenhum componente cadastrado</h3>
                  <p className="text-sm">Adicione um componente para começar a acompanhar custos e estoque.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormModalOpen && (
        <ComponentFormModal component={editingComponent} onSave={handleSaveComponent} onClose={() => setIsFormModalOpen(false)} />
      )}
      {isPurchaseModalOpen && (
        <ComponentPurchaseModal
          components={components}
          onSave={handleRegisterPurchase}
          onClose={() => setIsPurchaseModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ComponentsPage;
