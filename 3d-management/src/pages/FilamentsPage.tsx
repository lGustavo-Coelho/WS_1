import React, { useState, useMemo, useEffect } from 'react';
import { Filament, Transaction, Settings, FilamentType } from '../types';
import { PlusIcon, PlusCircleIcon, EditIcon, TrashIcon, ChevronDownIcon } from '../components/Icons';
import { dataService } from '../services/dataService';
import { useAppStore } from '../store/appStore';
import { logger } from '../utils/logger';

interface FilamentFormModalProps {
  filament: Filament | null;
  onSave: (filament: Filament) => void;
  onClose: () => void;
}

const FilamentFormModal: React.FC<FilamentFormModalProps> = ({ filament, onSave, onClose }) => {
  type FilamentFormFields = keyof Omit<Filament, 'id' | 'created_at' | 'updated_at'>;

  const [formData, setFormData] = useState<Omit<Filament, 'id' | 'created_at' | 'updated_at'>>(
    filament || { 
      name: '', 
      type: 'PLA', 
      color: '', 
      brand: '',
      stock_kg: 1,
      cost_per_kg: 0,
      density: 1.24,
      purchase_date: new Date().toISOString().split('T')[0] 
    }
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      if (name === 'stock_kg' || name === 'cost_per_kg' || name === 'density') {
        return { ...prev, [name]: parseFloat(value) || 0 };
      }

      if (name === 'type') {
        return { ...prev, type: value as FilamentType };
      }

      const key = name as FilamentFormFields;
      return { ...prev, [key]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const filamentToSave: Filament = { ...formData as any, id: filament?.id || `FIL-${Date.now()}` };
      onSave(filamentToSave);
    } catch (error) {
      logger.error('Error saving filament', { error });
      alert('Erro ao salvar filamento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">{filament ? 'Editar Filamento' : 'Adicionar Filamento'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Nome do Filamento</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: PLA Premium" className="mt-1 w-full" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Tipo</label>
              <select name="type" value={formData.type} onChange={handleChange} className="mt-1 w-full">
                <option value="PLA">PLA</option>
                <option value="ABS">ABS</option>
                <option value="PETG">PETG</option>
                <option value="TPU">TPU</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Cor</label>
              <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="Ex: Azul Royal" className="mt-1 w-full" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Marca</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Ex: MatterHackers" className="mt-1 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Estoque (kg)</label>
              <input type="number" step="0.01" name="stock_kg" value={formData.stock_kg} onChange={handleChange} className="mt-1 w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Custo / kg (R$)</label>
              <input type="number" step="0.01" name="cost_per_kg" value={formData.cost_per_kg} onChange={handleChange} className="mt-1 w-full" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Data da Compra</label>
            <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} className="mt-1 w-full" required />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold rounded-md transition" disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition disabled:opacity-50" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface FilamentPurchaseModalProps {
  filaments: Filament[];
  onSave: (data: { filamentId: string; weightKg: number; costPerKg: number; purchaseDate: string }) => void;
  onClose: () => void;
}

const FilamentPurchaseModal: React.FC<FilamentPurchaseModalProps> = ({ filaments, onSave, onClose }) => {
  const [filamentId, setFilamentId] = useState<string>(filaments[0]?.id || '');
  const [weightKg, setWeightKg] = useState(1);
  const [costPerKg, setCostPerKg] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filamentId) {
      alert('Por favor, selecione um filamento.');
      return;
    }
    setIsLoading(true);
    try {
      onSave({ filamentId, weightKg, costPerKg, purchaseDate });
    } catch (error) {
      logger.error('Error registering purchase', { error });
      alert('Erro ao registrar compra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Cadastrar Compra de Filamento</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Filamento</label>
            <select value={filamentId} onChange={(e) => setFilamentId(e.target.value)} className="mt-1 w-full" required>
              <option value="">Selecione um filamento...</option>
              {filaments.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.type} - {f.color})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Peso Comprado (kg)</label>
              <input type="number" step="0.1" value={weightKg} onChange={e => setWeightKg(parseFloat(e.target.value) || 0)} className="mt-1 w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Custo (por kg R$)</label>
              <input type="number" step="0.01" value={costPerKg} onChange={e => setCostPerKg(parseFloat(e.target.value) || 0)} className="mt-1 w-full" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Data de Compra</label>
            <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="mt-1 w-full" required />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold rounded-md transition" disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition disabled:opacity-50" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrar Compra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const SortableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="py-3 px-6 font-medium">
    <div className="flex items-center group cursor-pointer">
      {children}
      <ChevronDownIcon className="h-4 w-4 ml-1 text-gray-500 group-hover:text-gray-200 transition-opacity opacity-0 group-hover:opacity-100" />
    </div>
  </th>
);

interface FilamentsPageProps {
  filaments: Filament[];
  setFilaments: React.Dispatch<React.SetStateAction<Filament[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  settings: Settings;
}

const FilamentsPage: React.FC<FilamentsPageProps> = ({ filaments, setFilaments, setTransactions, settings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFilament, setEditingFilament] = useState<Filament | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const { setLoading, setError } = useAppStore();

  useEffect(() => {
    const loadFilaments = async () => {
      setLoading(true);
      try {
        const data = await dataService.getFilaments();
        setFilaments(data);
        setError(null);
      } catch (err) {
        logger.error('Failed to load filaments', { error: err });
        setError('Erro ao carregar filamentos');
      } finally {
        setLoading(false);
      }
    };
    
    if (filaments.length === 0) {
      loadFilaments();
    }
  }, []);

  const filteredFilaments = useMemo(() => {
    return filaments
      .filter(f => nameFilter ? f.name.toLowerCase().includes(nameFilter.toLowerCase()) : true)
      .filter(f => typeFilter !== 'all' ? f.type === typeFilter : true);
  }, [filaments, nameFilter, typeFilter]);

  const handleSaveFilament = async (filament: Filament) => {
    setLoading(true);
    try {
      if (editingFilament) {
        const updated = await dataService.updateFilament(filament.id, filament);
        setFilaments(prev => prev.map(f => (f.id === updated.id ? updated : f)));
      } else {
        const created = await dataService.createFilament(filament);
        setFilaments(prev => [...prev, created]);
      }
      setError(null);
      closeModal();
    } catch (err) {
      logger.error('Failed to save filament', { error: err });
      setError('Erro ao salvar filamento');
      alert('Erro ao salvar filamento');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFilament = async (filamentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este filamento?')) {
      setLoading(true);
      try {
        await dataService.deleteFilament(filamentId);
        setFilaments(filaments.filter(f => f.id !== filamentId));
        setError(null);
      } catch (err) {
        logger.error('Failed to delete filament', { error: err });
        setError('Erro ao excluir filamento');
        alert('Erro ao excluir filamento');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRegisterPurchase = async (data: { filamentId: string; weightKg: number; costPerKg: number; purchaseDate: string }) => {
    setLoading(true);
    try {
      const selectedFilament = filaments.find(f => f.id === data.filamentId);
      if (!selectedFilament) return;

      const updatePayload: Partial<Filament> = {
        stock_kg: selectedFilament.stock_kg + data.weightKg,
        cost_per_kg: data.costPerKg,
        purchase_date: data.purchaseDate,
      };

      const updated = await dataService.updateFilament(data.filamentId, updatePayload);
      setFilaments(prev => prev.map(f => (f.id === updated.id ? updated : f)));

      const totalCost = data.weightKg * data.costPerKg;
      const newTransaction: Transaction = {
        id: `TRN-FIL-${Date.now()}`,
        date: new Date(data.purchaseDate).toISOString(),
        description: `Compra de filamento: ${selectedFilament.name} (${(data.weightKg * 1000).toFixed(0)}g)`,
        amount: totalCost,
        type: 'expense',
        category: 'Compra de Suprimento',
      };
      setTransactions(prev => [newTransaction, ...prev]);

      setError(null);
      setIsPurchaseModalOpen(false);
    } catch (err) {
      logger.error('Failed to register purchase', { error: err });
      setError('Erro ao registrar compra');
      alert('Erro ao registrar compra');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (filament: Filament | null = null) => {
    setEditingFilament(filament);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingFilament(null);
    setIsModalOpen(false);
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: settings.currency }).format(value);

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Filtrar por nome..." 
            value={nameFilter}
            onChange={e => setNameFilter(e.target.value)}
            className="w-full md:w-64"
          />
          <select 
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="w-full md:w-auto"
          >
            <option value="all">Todos os Tipos</option>
            <option value="PLA">PLA</option>
            <option value="ABS">ABS</option>
            <option value="PETG">PETG</option>
            <option value="TPU">TPU</option>
          </select>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button onClick={() => setIsPurchaseModalOpen(true)} className="flex-1 md:flex-initial w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Registrar Compra
          </button>
          <button onClick={() => openModal()} className="flex-1 md:flex-initial w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition">
            <PlusIcon className="h-5 w-5 mr-2" />
            Adicionar Filamento
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-700/50 text-sm text-gray-400 uppercase tracking-wider">
              <SortableHeader>Nome</SortableHeader>
              <SortableHeader>Tipo</SortableHeader>
              <SortableHeader>Cor</SortableHeader>
              <SortableHeader>Marca</SortableHeader>
              <SortableHeader>Estoque (kg)</SortableHeader>
              <SortableHeader>Custo/kg</SortableHeader>
              <SortableHeader>Data Compra</SortableHeader>
              <th className="py-3 px-6 font-medium text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {filteredFilaments.length > 0 ? filteredFilaments.map(filament => (
              <tr key={filament.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="py-4 px-6 font-medium text-gray-100">{filament.name}</td>
                <td className="py-4 px-6">{filament.type}</td>
                <td className="py-4 px-6">{filament.color}</td>
                <td className="py-4 px-6">{filament.brand || '-'}</td>
                <td className="py-4 px-6">{filament.stock_kg.toFixed(2)}kg</td>
                <td className="py-4 px-6">{formatCurrency(filament.cost_per_kg)}</td>
                <td className="py-4 px-6">{filament.purchase_date ? new Date(filament.purchase_date).toLocaleDateString('pt-BR') : '-'}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center space-x-3">
                    <button onClick={() => openModal(filament)} className="text-blue-400 hover:text-blue-300"><EditIcon className="h-5 w-5" /></button>
                    <button onClick={() => handleDeleteFilament(filament.id)} className="text-red-400 hover:text-red-300"><TrashIcon className="h-5 w-5" /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8} className="text-center py-16 text-gray-500">
                  Nenhum filamento encontrado. Tente ajustar seus filtros ou adicione um novo filamento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && <FilamentFormModal filament={editingFilament} onSave={handleSaveFilament} onClose={closeModal} />}
      {isPurchaseModalOpen && (
        <FilamentPurchaseModal
          filaments={filaments}
          onSave={handleRegisterPurchase}
          onClose={() => setIsPurchaseModalOpen(false)}
        />
      )}
    </div>
  );
};

export default FilamentsPage;
