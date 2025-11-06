import React, { useState, useMemo } from 'react';
import { Investment, Settings, InvestmentType } from '../types';
import { PlusIcon, EditIcon, TrashIcon, TrendingUpIcon } from '../components/Icons';

interface InvestmentFormModalProps {
  investment: Investment | null;
  onSave: (investment: Investment) => void;
  onClose: () => void;
}

const InvestmentFormModal: React.FC<InvestmentFormModalProps> = ({ investment, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Investment, 'id' | 'currentValue'>>(
    investment 
      ? { name: investment.name, purchaseDate: investment.purchaseDate.split('T')[0], initialCost: investment.initialCost, type: investment.type, description: investment.description || '' }
      : { name: '', purchaseDate: new Date().toISOString().split('T')[0], initialCost: 0, type: 'equipment', description: '' }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newState = { ...prev };
        if (name === 'initialCost') {
            newState.initialCost = parseFloat(value) || 0;
        } else if (name === 'type') {
            newState.type = value as InvestmentType;
        } else {
            newState[name as 'name' | 'purchaseDate' | 'description'] = value;
        }
        return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const investmentToSave: Investment = { 
        ...formData, 
        id: investment?.id || `INV-${Date.now()}`,
        currentValue: investment?.currentValue || formData.initialCost
    };
    onSave(investmentToSave);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-100">{investment ? 'Editar Investimento' : 'Adicionar Investimento'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-3xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
              <label className="block text-sm font-medium text-gray-300">Nome/Título do Investimento</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1" required />
            </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-300">Data</label>
                <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} className="mt-1" required />
              </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Valor (R$)</label>
              <input type="number" step="0.01" name="initialCost" value={formData.initialCost} onChange={handleChange} className="mt-1" required />
            </div>
          </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Tipo</label>
                <select name="type" value={formData.type} onChange={handleChange} className="mt-1">
                    <option value="equipment">Equipamento</option>
                    <option value="software">Software</option>
                    <option value="other">Outro</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Descrição (Opcional)</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1"></textarea>
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


interface InvestmentsPageProps {
    investments: Investment[];
    setInvestments: React.Dispatch<React.SetStateAction<Investment[]>>;
    settings: Settings;
}

const InvestmentsPage: React.FC<InvestmentsPageProps> = ({ investments, setInvestments, settings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [filter, setFilter] = useState('');

  const handleSaveInvestment = (investment: Investment) => {
    if (editingInvestment) {
      setInvestments(investments.map(i => i.id === investment.id ? investment : i));
    } else {
      setInvestments([investment, ...investments]);
    }
    closeModal();
  };
  
  const handleDeleteInvestment = (investmentId: string) => {
    if(window.confirm('Tem certeza que deseja excluir este investimento?')) {
        setInvestments(investments.filter(i => i.id !== investmentId));
    }
  };

  const openModal = (investment: Investment | null = null) => {
    setEditingInvestment(investment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingInvestment(null);
    setIsModalOpen(false);
  };
  
  const filteredInvestments = useMemo(() => {
    return investments.filter(i => i.name.toLowerCase().includes(filter.toLowerCase()));
  }, [investments, filter]);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: settings.currency }).format(value);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

  return (
    <>
      <div className="flex justify-between items-center mb-6">
         <div className="w-full md:w-1/3">
             <input
              type="text"
              placeholder="Filtrar por nome..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
         </div>
         <button onClick={() => openModal()} className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition whitespace-nowrap">
             <PlusIcon className="h-5 w-5 mr-2" />
             Adicionar Investimento
         </button>
      </div>
      
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        {filteredInvestments.length > 0 ? (
          <div className="overflow-x-auto">
              <table className="w-full text-left">
              <thead>
                  <tr className="bg-gray-700/50 text-sm text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-6 font-medium">Nome</th>
                    <th className="py-3 px-6 font-medium">Tipo</th>
                    <th className="py-3 px-6 font-medium">Data da Compra</th>
                    <th className="py-3 px-6 font-medium">Custo Inicial</th>
                    <th className="py-3 px-6 font-medium">Valor Atual</th>
                    <th className="py-3 px-6 font-medium text-center">Ações</th>
                  </tr>
              </thead>
              <tbody className="text-gray-300">
                {filteredInvestments.map(inv => (
                    <tr key={inv.id} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="py-4 px-6 font-medium text-gray-100">{inv.name}</td>
                        <td className="py-4 px-6 capitalize">{inv.type}</td>
                        <td className="py-4 px-6">{formatDate(inv.purchaseDate)}</td>
                        <td className="py-4 px-6">{formatCurrency(inv.initialCost)}</td>
                        <td className="py-4 px-6">{formatCurrency(inv.currentValue)}</td>
                        <td className="py-4 px-6">
                            <div className="flex items-center justify-center space-x-3">
                                <button onClick={() => openModal(inv)} className="text-blue-400 hover:text-blue-300"><EditIcon className="h-5 w-5" /></button>
                                <button onClick={() => handleDeleteInvestment(inv.id)} className="text-red-400 hover:text-red-300"><TrashIcon className="h-5 w-5" /></button>
                            </div>
                        </td>
                    </tr>
                ))}
              </tbody>
              </table>
          </div>
        ) : (
             <div className="text-center py-20 text-gray-500">
                <TrendingUpIcon className="h-16 w-16 mx-auto text-gray-600" />
                <h3 className="mt-2 text-lg font-medium">Nenhum investimento registrado</h3>
                <p className="text-sm">Comece a adicionar seus investimentos para acompanhar o ROI.</p>
            </div>
        )}
      </div>

      {isModalOpen && <InvestmentFormModal investment={editingInvestment} onSave={handleSaveInvestment} onClose={closeModal} />}
    </>
  );
};

export default InvestmentsPage;
