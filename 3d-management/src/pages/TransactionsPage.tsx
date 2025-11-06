import React, { useState, useMemo } from 'react';
import { Transaction, TransactionCategory, Settings, TransactionType } from '../types';
import { PlusIcon, EditIcon, TrashIcon, CreditCardIcon } from '../components/Icons';

const transactionCategories: TransactionCategory[] = [
    'Compra de Suprimento',
    'Despesa Operacional',
    'Compra de Equipamento',
    'Receita de Venda',
    'Investimento',
    'Outro'
];

interface TransactionFormModalProps {
  transaction: Transaction | null;
  onSave: (transaction: Transaction) => void;
  onClose: () => void;
}

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({ transaction, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>(
    transaction 
      ? { ...transaction, date: transaction.date.split('T')[0] }
      : { 
          date: new Date().toISOString().split('T')[0], 
          description: '', 
          amount: 0, 
          type: 'expense', 
          category: 'Outro', 
          notes: '' 
      }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newState = { ...prev };
        if (name === 'amount') {
            newState.amount = parseFloat(value) || 0;
        } else if (name === 'type') {
            newState.type = value as TransactionType;
        } else if (name === 'category') {
            newState.category = value as TransactionCategory;
        } else {
            newState[name as 'date' | 'description' | 'notes'] = value;
        }
        return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) {
        alert('O valor da transação deve ser maior que zero.');
        return;
    }
    const transactionToSave: Transaction = { 
        ...formData, 
        id: transaction?.id || `TRN-${Date.now()}`
    };
    onSave(transactionToSave);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-100">{transaction ? 'Editar Transação' : 'Adicionar Transação'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-3xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Data</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Descrição</label>
              <input type="text" name="description" value={formData.description} onChange={handleChange} className="mt-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Valor (R$)</label>
              <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} className="mt-1" required />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Tipo</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="mt-1">
                        <option value="expense">Saída</option>
                        <option value="income">Entrada</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Categoria</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="mt-1">
                        {transactionCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-300">Notas (Opcional)</label>
                <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={2} className="mt-1"></textarea>
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


interface TransactionsPageProps {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    settings: Settings;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, setTransactions, settings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const currentBalance = useMemo(() => 
    transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0),
  [transactions]);

  const handleSaveTransaction = (transaction: Transaction) => {
    // The date from the form is 'YYYY-MM-DD'. To keep it consistent as an ISO string, convert it.
    const transactionToSave = { ...transaction, date: new Date(transaction.date).toISOString() };
    
    if (editingTransaction) {
      setTransactions(transactions.map(t => t.id === transactionToSave.id ? transactionToSave : t));
    } else {
      setTransactions([transactionToSave, ...transactions]);
    }
    closeModal();
  };
  
  const handleDeleteTransaction = (transactionId: string) => {
    if(window.confirm('Tem certeza que deseja excluir esta transação?')) {
        setTransactions(transactions.filter(t => t.id !== transactionId));
    }
  };

  const openModal = (transaction: Transaction | null = null) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(false);
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: settings.currency }).format(value);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

  return (
    <>
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
            <h3 className="text-sm font-medium text-gray-400">Saldo Atual</h3>
            <p className={`text-3xl font-bold ${currentBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(currentBalance)}
            </p>
        </div>
        <button onClick={() => openModal()} className="w-full md:w-auto flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition">
            <PlusIcon className="h-5 w-5 mr-2" />
          Adicionar Transação
        </button>
      </div>

      <div className="overflow-x-auto">
          <table className="w-full text-left">
          <thead>
              <tr className="bg-gray-700/50 text-sm text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-6 font-medium">Data</th>
                <th className="py-3 px-6 font-medium">Descrição</th>
                <th className="py-3 px-6 font-medium">Categoria</th>
                <th className="py-3 px-6 font-medium">Tipo</th>
                <th className="py-3 px-6 font-medium text-right">Valor</th>
                <th className="py-3 px-6 font-medium text-center">Ações</th>
              </tr>
          </thead>
          <tbody className="text-gray-300">
            {transactions.length > 0 ? (
                transactions.map(t => (
                    <tr key={t.id} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="py-4 px-6">{formatDate(t.date)}</td>
                        <td className="py-4 px-6 font-medium text-gray-200">{t.description}</td>
                        <td className="py-4 px-6">{t.category}</td>
                        <td className="py-4 px-6">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                t.type === 'income' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                                {t.type === 'income' ? 'Entrada' : 'Saída'}
                            </span>
                        </td>
                        <td className={`py-4 px-6 text-right font-semibold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                            {t.type === 'expense' && '- '}{formatCurrency(t.amount)}
                        </td>
                        <td className="py-4 px-6">
                            <div className="flex items-center justify-center space-x-3">
                                <button onClick={() => openModal(t)} className="text-blue-400 hover:text-blue-300"><EditIcon className="h-5 w-5" /></button>
                                <button onClick={() => handleDeleteTransaction(t.id)} className="text-red-400 hover:text-red-300"><TrashIcon className="h-5 w-5" /></button>
                            </div>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-500">
                    <CreditCardIcon className="h-12 w-12 mx-auto text-gray-600" />
                    <p className="mt-2 font-medium">Nenhuma transação financeira cadastrada.</p>
                  </td>
                </tr>
            )}
          </tbody>
          </table>
      </div>
    </div>
    {isModalOpen && <TransactionFormModal transaction={editingTransaction} onSave={handleSaveTransaction} onClose={closeModal} />}
    </>
  );
};

export default TransactionsPage;
