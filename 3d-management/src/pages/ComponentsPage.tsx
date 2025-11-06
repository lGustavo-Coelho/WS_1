import React, { useState, useMemo } from 'react';
import { Component, Transaction, Settings } from '../types';
import { PlusIcon, PlusCircleIcon, EditIcon, TrashIcon, WrenchIcon } from '../components/Icons';

// Modal for Adding/Editing a Component
interface ComponentFormModalProps {
  component: Component | null;
  onSave: (component: Component, isNew: boolean) => void;
  onClose: () => void;
}

const ComponentFormModal: React.FC<ComponentFormModalProps> = ({ component, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Component, 'id'>>(
    component || {
      name: '',
      unit: '',
      stock: 0,
      costPerUnit: 0,
      supplier: '',
      purchaseDate: new Date().toISOString().split('T')[0]
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newValues = { ...prev };
        if (name === 'stock' || name === 'costPerUnit') {
            newValues[name] = parseFloat(value) || 0;
        } else {
            newValues[name as 'name' | 'unit' | 'supplier' | 'purchaseDate'] = value;
        }
        return newValues;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !component;
    const componentToSave = { ...formData, id: component?.id || `COMP-${Date.now()}` };
    onSave(componentToSave, isNew);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">{component ? 'Editar Componente' : 'Adicionar Componente'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Nome do Componente</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Unidade (ex: peça, metro, kit)</label>
              <input type="text" name="unit" value={formData.unit} onChange={handleChange} className="mt-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Quantidade em Estoque</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="mt-1" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-300">Custo por Unidade (R$)</label>
              <input type="number" step="0.01" name="costPerUnit" value={formData.costPerUnit} onChange={handleChange} className="mt-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Fornecedor (Opcional)</label>
              <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} className="mt-1" />
            </div>
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-300">Data de Compra (Opcional)</label>
              <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} className="mt-1" />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold rounded-md transition">Cancelar</button>
            <button type="submit" className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for Registering a Purchase
interface ComponentPurchaseModalProps {
  components: Component[];
  onSave: (data: { componentId: string; quantity: number; costPerUnit: number; purchaseDate: string }) => void;
  onClose: () => void;
}

const ComponentPurchaseModal: React.FC<ComponentPurchaseModalProps> = ({ components, onSave, onClose }) => {
    const [componentId, setComponentId] = useState<string>(components[0]?.id || '');
    const [quantity, setQuantity] = useState(1);
    const [costPerUnit, setCostPerUnit] = useState(0);
    const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!componentId) {
            alert('Por favor, selecione um componente.');
            return;
        }
        onSave({ componentId, quantity, costPerUnit, purchaseDate });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Registrar Compra de Componente</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Componente</label>
                        <select value={componentId} onChange={(e) => setComponentId(e.target.value)} className="mt-1" required>
                            <option value="">Selecione um componente...</option>
                            {components.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Quantidade Comprada</label>
                            <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 0)} className="mt-1" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Custo por Unidade (R$)</label>
                            <input type="number" step="0.01" value={costPerUnit} onChange={e => setCostPerUnit(parseFloat(e.target.value) || 0)} className="mt-1" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Data da Compra (Opcional)</label>
                        <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="mt-1" />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold rounded-md transition">Cancelar</button>
                        <button type="submit" className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition">Registrar Compra</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main Page Component
interface ComponentsPageProps {
  components: Component[];
  setComponents: React.Dispatch<React.SetStateAction<Component[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  settings: Settings;
}

const ComponentsPage: React.FC<ComponentsPageProps> = ({ components, setComponents, setTransactions, settings }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [filter, setFilter] = useState('');

  const filteredComponents = useMemo(() => {
    return components.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
  }, [components, filter]);

  const handleSaveComponent = (component: Component, isNew: boolean) => {
    if (isNew) {
      setComponents(prev => [component, ...prev]);
      // Create initial purchase transaction if stock is added
      if (component.stock > 0 && component.costPerUnit > 0) {
        const totalCost = component.stock * component.costPerUnit;
        const newTransaction: Transaction = {
            id: `TRN-COMP-${Date.now()}`,
            date: new Date(component.purchaseDate || Date.now()).toISOString(),
            description: `Compra inicial de componente: ${component.name}`,
            amount: totalCost,
            type: 'expense',
            category: 'Compra de Suprimento',
        };
        setTransactions(prev => [newTransaction, ...prev]);
      }
    } else {
      setComponents(prev => prev.map(c => c.id === component.id ? component : c));
    }
    closeAddModal();
  };
  
  const handleDeleteComponent = (componentId: string) => {
    if(window.confirm('Tem certeza que deseja excluir este componente?')) {
        setComponents(prev => prev.filter(c => c.id !== componentId));
    }
  };

  const handleRegisterPurchase = (data: { componentId: string; quantity: number; costPerUnit: number; purchaseDate: string }) => {
    const selectedComponent = components.find(c => c.id === data.componentId);
    if (!selectedComponent) return;

    setComponents(prev => prev.map(c =>
        c.id === data.componentId
        ? { ...c, stock: c.stock + data.quantity, costPerUnit: data.costPerUnit, purchaseDate: new Date(data.purchaseDate).toISOString() }
        : c
    ));

    const totalCost = data.quantity * data.costPerUnit;
    const newTransaction: Transaction = {
        id: `TRN-COMP-${Date.now()}`,
        date: new Date(data.purchaseDate).toISOString(),
        description: `Compra de componente: ${selectedComponent.name} (x${data.quantity})`,
        amount: totalCost,
        type: 'expense',
        category: 'Compra de Suprimento',
    };
    setTransactions(prev => [newTransaction, ...prev]);

    setIsPurchaseModalOpen(false);
  };

  const openAddModal = (component: Component | null = null) => {
    setEditingComponent(component);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setEditingComponent(null);
    setIsAddModalOpen(false);
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: settings.currency }).format(value);
  const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A';

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input 
          type="text" 
          placeholder="Filtrar por nome..." 
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full md:w-64"
        />
        <div className="flex items-center space-x-3 w-full md:w-auto">
            <button onClick={() => setIsPurchaseModalOpen(true)} className="flex-1 md:flex-initial w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Registrar Compra
            </button>
            <button onClick={() => openAddModal()} className="flex-1 md:flex-initial w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition">
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
                <th className="py-3 px-6 font-medium">Unidade</th>
                <th className="py-3 px-6 font-medium">Estoque</th>
                <th className="py-3 px-6 font-medium">Custo</th>
                <th className="py-3 px-6 font-medium">Fornecedor</th>
                <th className="py-3 px-6 font-medium">Data Compra</th>
                <th className="py-3 px-6 font-medium text-center">Ações</th>
              </tr>
          </thead>
          <tbody className="text-gray-300">
            {filteredComponents.length > 0 ? (
                filteredComponents.map(c => (
                    <tr key={c.id} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="py-4 px-6 font-medium text-gray-100">{c.name}</td>
                        <td className="py-4 px-6">{c.unit}</td>
                        <td className="py-4 px-6 font-semibold">{c.stock}</td>
                        <td className="py-4 px-6">{formatCurrency(c.costPerUnit)}</td>
                        <td className="py-4 px-6">{c.supplier || 'N/A'}</td>
                        <td className="py-4 px-6">{formatDate(c.purchaseDate)}</td>
                        <td className="py-4 px-6">
                            <div className="flex items-center justify-center space-x-3">
                                <button onClick={() => openAddModal(c)} className="text-blue-400 hover:text-blue-300"><EditIcon className="h-5 w-5" /></button>
                                <button onClick={() => handleDeleteComponent(c.id)} className="text-red-400 hover:text-red-300"><TrashIcon className="h-5 w-5" /></button>
                            </div>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-gray-500">
                    <WrenchIcon className="h-16 w-16 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">Nenhum componente cadastrado</h3>
                    <p className="text-sm">Comece adicionando seus componentes (parafusos, eletrônicos, etc.)</p>
                  </td>
                </tr>
            )}
          </tbody>
          </table>
      </div>

      {isAddModalOpen && <ComponentFormModal component={editingComponent} onSave={handleSaveComponent} onClose={closeAddModal} />}
      {isPurchaseModalOpen && <ComponentPurchaseModal components={components} onSave={handleRegisterPurchase} onClose={() => setIsPurchaseModalOpen(false)} />}
    </div>
  );
};

export default ComponentsPage;
