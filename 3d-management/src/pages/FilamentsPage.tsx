import React, { useState, useMemo } from 'react';
import { Filament, Transaction, Settings, FilamentType } from '../types';
import { PlusIcon, PlusCircleIcon, EditIcon, TrashIcon, ChevronDownIcon } from '../components/Icons';

interface FilamentFormModalProps {
  filament: Filament | null;
  onSave: (filament: Filament) => void;
  onClose: () => void;
}

const FilamentFormModal: React.FC<FilamentFormModalProps> = ({ filament, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Filament, 'id'>>(
    filament || { name: '', type: 'PLA', color: '', stock: 1000, costPerKg: 0, purchaseDate: new Date().toISOString().split('T')[0] }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev };
      if (name === 'stock' || name === 'costPerKg') {
        updated[name] = parseFloat(value) || 0;
      } else if (name === 'type') {
        updated[name] = value as FilamentType;
      } else {
        updated[name as 'name' | 'color' | 'purchaseDate'] = value;
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filamentToSave = { ...formData, id: filament?.id || `FIL-${Date.now()}` };
    onSave(filamentToSave);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">{filament ? 'Editar Filamento' : 'Adicionar Filamento'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
              <label className="block text-sm font-medium text-gray-300">Nome do Filamento</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: PLA Premium" className="mt-1" required />
            </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-300">Tipo</label>
                <select name="type" value={formData.type} onChange={handleChange} className="mt-1">
                    <option>PLA</option>
                    <option>ABS</option>
                    <option>PETG</option>
                    <option>TPU</option>
                </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-300">Cor</label>
              <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="Ex: Azul Royal" className="mt-1" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Estoque (g)</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="mt-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Custo / kg (R$)</label>
              <input type="number" step="0.01" name="costPerKg" value={formData.costPerKg} onChange={handleChange} className="mt-1" required />
            </div>
          </div>
           <div>
              <label className="block text-sm font-medium text-gray-300">Data da Compra</label>
              <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} className="mt-1" required />
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

interface FilamentPurchaseModalProps {
  filaments: Filament[];
  onSave: (data: { filamentId: string; weight: number; costPerKg: number; purchaseDate: string }) => void;
  onClose: () => void;
}

const FilamentPurchaseModal: React.FC<FilamentPurchaseModalProps> = ({ filaments, onSave, onClose }) => {
    const [filamentId, setFilamentId] = useState<string>(filaments[0]?.id || '');
    const [weight, setWeight] = useState(1000);
    const [costPerKg, setCostPerKg] = useState(0);
    const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!filamentId) {
            alert('Por favor, selecione um filamento.');
            return;
        }
        onSave({ filamentId, weight, costPerKg, purchaseDate });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Cadastrar Compra de Filamento</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Filamento</label>
                        <select value={filamentId} onChange={(e) => setFilamentId(e.target.value)} className="mt-1" required>
                            <option value="">Selecione um filamento...</option>
                            {filaments.map(f => (
                                <option key={f.id} value={f.id}>{f.name} ({f.type} - {f.color})</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Peso Comprado (gramas)</label>
                            <input type="number" value={weight} onChange={e => setWeight(parseInt(e.target.value) || 0)} className="mt-1" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Custo (por kg R$)</label>
                            <input type="number" step="0.01" value={costPerKg} onChange={e => setCostPerKg(parseFloat(e.target.value) || 0)} className="mt-1" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Data de Compra (Opcional)</label>
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

  const filteredFilaments = useMemo(() => {
    return filaments
        .filter(f => nameFilter ? f.name.toLowerCase().includes(nameFilter.toLowerCase()) : true)
        .filter(f => typeFilter !== 'all' ? f.type === typeFilter : true);
  }, [filaments, nameFilter, typeFilter]);

  const handleSaveFilament = (filament: Filament) => {
    if (editingFilament) {
      setFilaments(filaments.map(f => f.id === filament.id ? filament : f));
    } else {
      setFilaments([...filaments, filament]);
    }
    closeModal();
  };
  
  const handleDeleteFilament = (filamentId: string) => {
    if(window.confirm('Tem certeza que deseja excluir este filamento?')) {
        setFilaments(filaments.filter(f => f.id !== filamentId));
    }
  };

  const handleRegisterPurchase = ({ filamentId, weight, costPerKg, purchaseDate }: { filamentId: string; weight: number; costPerKg: number; purchaseDate: string }) => {
    const selectedFilament = filaments.find(f => f.id === filamentId);
    if (!selectedFilament) return;

    setFilaments(prev => prev.map(f =>
        f.id === filamentId
        ? { ...f, stock: f.stock + weight, costPerKg, purchaseDate: new Date(purchaseDate).toISOString() }
        : f
    ));

    const totalCost = (weight / 1000) * costPerKg;
    const newTransaction: Transaction = {
        id: `TRN-FIL-${Date.now()}`,
        date: new Date(purchaseDate).toISOString(),
        description: `Compra de filamento: ${selectedFilament.name} (${weight}g)`,
        amount: totalCost,
        type: 'expense',
        category: 'Compra de Suprimento',
    };
    setTransactions(prev => [newTransaction, ...prev]);

    setIsPurchaseModalOpen(false);
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
                <option>PLA</option>
                <option>ABS</option>
                <option>PETG</option>
                <option>TPU</option>
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
                <SortableHeader>Estoque (g)</SortableHeader>
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
                      <td className="py-4 px-6">{filament.stock}g</td>
                      <td className="py-4 px-6">{formatCurrency(filament.costPerKg)}</td>
                      <td className="py-4 px-6">{new Date(filament.purchaseDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                      <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-3">
                              <button onClick={() => openModal(filament)} className="text-blue-400 hover:text-blue-300"><EditIcon className="h-5 w-5" /></button>
                              <button onClick={() => handleDeleteFilament(filament.id)} className="text-red-400 hover:text-red-300"><TrashIcon className="h-5 w-5" /></button>
                          </div>
                      </td>
                  </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-500">
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
