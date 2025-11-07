import React, { useState, useMemo } from 'react';
import { Quote, Settings, Filament, Printer, QuoteItem, PrintJob } from '../types';
import { PlusIcon, FileTextIcon, TrashIcon, BoltIcon, UserIcon, PackageIcon, CheckCircleIcon, XCircleIcon } from '../components/Icons';

interface QuoteCalculatorModalProps {
    onClose: () => void;
    onSave: (newQuote: Quote) => void;
    settings: Settings;
    filaments: Filament[];
    printers: Printer[];
}

const EXPECTED_PRINTER_LIFETIME_HOURS = 5000;

// Helper to create initial quote item
const createInitialQuoteItem = (filaments: Filament[], printers: Printer[]): QuoteItem => ({
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    description: '',
    filamentGrams: 0,
    printHours: 0,
    postProcessingHours: 0,
    filamentId: filaments[0]?.id || '',
    printerId: printers[0]?.id || '',
    price: 0
});

const QuoteCalculatorModal: React.FC<QuoteCalculatorModalProps> = ({ onClose, onSave, settings, filaments, printers }) => {
    const [customerName, setCustomerName] = useState('');
    const [designHours, setDesignHours] = useState(0);
    const [preparationHours, setPreparationHours] = useState(0);
    const [items, setItems] = useState<QuoteItem[]>(() => [createInitialQuoteItem(filaments, printers)]);

    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: settings.currency }).format(value);

    const calculationResult = useMemo(() => {
        type CalculatedQuoteItem = QuoteItem & { 
            materialCost?: number; 
            machineCost?: number; 
            postProcessingCost?: number; 
        };
        
        const calculatedItems: CalculatedQuoteItem[] = items.map(item => {
            const filament = filaments.find(f => f.id === item.filamentId);
            const printer = printers.find(p => p.id === item.printerId);

            if (!filament || !printer) return { ...item, price: 0 };

            const materialCost = (item.filamentGrams / 1000) * filament.cost_per_kg;
            const printerPowerKw = printer.power_consumption / 1000;
            const energyCost = item.printHours * printerPowerKw * settings.kwhCost;
            const depreciationPerHour = printer.purchase_price / EXPECTED_PRINTER_LIFETIME_HOURS;
            const depreciationCost = item.printHours * depreciationPerHour;
            const postProcessingCost = item.postProcessingHours * settings.postProcessingHourlyRate;
            
            const machineCost = energyCost + depreciationCost;

            const subtotal = materialCost + machineCost + postProcessingCost;
            const finalPrice = subtotal * (1 + settings.profitMargin / 100);

            return { ...item, price: finalPrice, materialCost, machineCost, postProcessingCost };
        });

        const totalMaterialCost = calculatedItems.reduce((sum, item) => sum + (item.materialCost || 0), 0);
        const totalMachineCost = calculatedItems.reduce((sum, item) => sum + (item.machineCost || 0), 0);
        const designCost = designHours * settings.designHourlyRate;
        const preparationCost = preparationHours * settings.preparationHourlyRate;
        const totalLaborCost = calculatedItems.reduce((sum, item) => sum + (item.postProcessingCost || 0), 0) + designCost + preparationCost;
        
        const totalSubtotal = totalMaterialCost + totalMachineCost + totalLaborCost;
        const grandTotal = totalSubtotal * (1 + settings.profitMargin / 100);

        return {
            calculatedItems,
            totalMaterialCost,
            totalMachineCost,
            totalLaborCost,
            totalSubtotal,
            grandTotal
        };

    }, [items, designHours, preparationHours, settings, filaments, printers]);

    const handleItemChange = (id: string, field: keyof Omit<QuoteItem, 'id' | 'price'>, value: string | number) => {
        setItems(currentItems =>
            currentItems.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item };
                    if (typeof value === 'number') {
                        updatedItem[field as 'filamentGrams' | 'printHours' | 'postProcessingHours'] = value;
                    } else {
                        updatedItem[field as 'description' | 'filamentId' | 'printerId'] = value;
                    }
                    return updatedItem;
                }
                return item;
            })
        );
    };

    const addItem = () => {
        setItems(prev => [...prev, createInitialQuoteItem(filaments, printers)]);
    };
    
    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(prev => prev.filter(item => item.id !== id));
        }
    };

    const handleSaveQuote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerName.trim()) {
            alert('Por favor, insira o nome do cliente.');
            return;
        }

        const newQuote: Quote = {
            id: `QTE-${Date.now()}`,
            customerName,
            date: new Date().toISOString(),
            status: 'pending',
            items: calculationResult.calculatedItems,
            totalPrice: calculationResult.grandTotal,
            designHours,
            preparationHours,
        };
        onSave(newQuote);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-100">Calculadora de Orçamento</h2>
                </div>
                <form onSubmit={handleSaveQuote} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Inputs */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Nome do Cliente</label>
                                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Nome do Cliente ou Empresa" />
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-200 border-b border-gray-700 pb-2">Itens do Orçamento</h3>
                                {items.map((item, index) => (
                                    <div key={item.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-3">
                                        <div className="flex justify-between items-center">
                                        <p className="font-medium text-gray-300">Item #{index + 1}</p>
                                        <button type="button" onClick={() => removeItem(item.id)} disabled={items.length <= 1} className="text-red-500 hover:text-red-400 disabled:text-gray-500 disabled:cursor-not-allowed"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                        <input type="text" placeholder="Descrição do item" value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} className="text-sm w-full"/>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <input type="number" placeholder="Horas de Impressão" value={item.printHours || ''} onChange={e => handleItemChange(item.id, 'printHours', parseFloat(e.target.value) || 0)} className="text-sm" title="Horas de Impressão"/>
                                            <input type="number" placeholder="Filamento (g)" value={item.filamentGrams || ''} onChange={e => handleItemChange(item.id, 'filamentGrams', parseFloat(e.target.value) || 0)} className="text-sm" title="Filamento (g)"/>
                                            <input type="number" placeholder="Pós-Proc. (h)" value={item.postProcessingHours || ''} onChange={e => handleItemChange(item.id, 'postProcessingHours', parseFloat(e.target.value) || 0)} className="text-sm" title="Horas de Pós-Processamento"/>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                            <select value={item.filamentId} onChange={e => handleItemChange(item.id, 'filamentId', e.target.value)} className="text-sm"><option value="">Filamento...</option>{filaments.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select>
                                            <select value={item.printerId} onChange={e => handleItemChange(item.id, 'printerId', e.target.value)} className="text-sm"><option value="">Impressora...</option>{printers.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addItem} className="text-sm text-emerald-400 font-semibold hover:text-emerald-300 flex items-center"><PlusIcon className="w-4 h-4 mr-1"/> Adicionar outro item</button>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-4">Custos Adicionais de Mão de Obra</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div><label className="text-sm font-medium text-gray-300">Horas de Design</label><input type="number" value={designHours || ''} onChange={e => setDesignHours(parseFloat(e.target.value) || 0)} className="mt-1 text-sm"/></div>
                                    <div><label className="text-sm font-medium text-gray-300">Horas de Preparação</label><input type="number" value={preparationHours || ''} onChange={e => setPreparationHours(parseFloat(e.target.value) || 0)} className="mt-1 text-sm"/></div>
                                </div>
                            </div>
                        </div>
                        {/* Calculation Summary */}
                        <div className="bg-gray-900/50 p-4 rounded-lg self-start border border-gray-700">
                            <h3 className="font-bold text-gray-200 text-lg mb-4">Resumo do Custo</h3>
                            <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center"><span className="flex items-center text-gray-400"><PackageIcon className="w-4 h-4 mr-2"/> Custo de Material</span> <span className="font-medium text-gray-200">{formatCurrency(calculationResult.totalMaterialCost)}</span></div>
                            <div className="flex justify-between items-center"><span className="flex items-center text-gray-400"><BoltIcon className="w-4 h-4 mr-2"/> Custo de Máquina</span> <span className="font-medium text-gray-200">{formatCurrency(calculationResult.totalMachineCost)}</span></div>
                            <div className="flex justify-between items-center"><span className="flex items-center text-gray-400"><UserIcon className="w-4 h-4 mr-2"/> Custo de Mão de Obra</span> <span className="font-medium text-gray-200">{formatCurrency(calculationResult.totalLaborCost)}</span></div>
                            <div className="flex justify-between items-center pt-2 border-t mt-2 border-gray-700"><span className="font-semibold text-gray-300">Subtotal</span> <span className="font-bold text-gray-100">{formatCurrency(calculationResult.totalSubtotal)}</span></div>
                            <div className="flex justify-between items-center text-xs text-gray-500"><span>Margem de Lucro</span> <span>{settings.profitMargin}%</span></div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg text-gray-100">Preço Final</span>
                                    <span className="font-extrabold text-xl text-emerald-400">{formatCurrency(calculationResult.grandTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold rounded-md transition">Cancelar</button>
                        <button type="submit" className="py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition">Salvar Orçamento</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


interface QuotesPageProps {
  quotes: Quote[];
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  settings: Settings;
  filaments: Filament[];
  printers: Printer[];
  setPrintJobs: React.Dispatch<React.SetStateAction<PrintJob[]>>;
}

const QuotesPage: React.FC<QuotesPageProps> = ({ quotes, setQuotes, settings, filaments, printers, setPrintJobs }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: settings.currency }).format(value);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

  const getStatusClass = (status: Quote['status']) => {
    switch (status) {
      case 'accepted': return 'bg-green-500/20 text-green-300';
      case 'rejected': return 'bg-yellow-500/20 text-yellow-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };
  
  const handleSaveQuote = (newQuote: Quote) => {
    setQuotes(prev => [newQuote, ...prev]);
    setIsModalOpen(false);
  };

  const handleUpdateQuoteStatus = (quoteId: string, status: 'accepted' | 'rejected') => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;

    if (status === 'accepted') {
        if (!window.confirm("Aceitar este orçamento irá criar os trabalhos de impressão correspondentes. Deseja continuar?")) return;

        // Stock validation
        const filamentNeeded: { [key: string]: number } = {};
        quote.items.forEach(item => {
            filamentNeeded[item.filamentId] = (filamentNeeded[item.filamentId] || 0) + item.filamentGrams;
        });

        for (const filamentId in filamentNeeded) {
            const filament = filaments.find(f => f.id === filamentId);
            const availableGrams = filament ? Math.round(filament.stock_kg * 1000) : 0;
            if (!filament || availableGrams < filamentNeeded[filamentId]) {
                alert(`Estoque insuficiente para o filamento ${filament?.name || 'desconhecido'}. Necessário: ${filamentNeeded[filamentId]}g, Disponível: ${availableGrams}g.`);
                return;
            }
        }
        
        // Create print jobs
        const newJobs: PrintJob[] = quote.items.map(item => ({
            id: `JOB-${quote.id}-${item.id}`,
            name: `[${quote.customerName}] ${item.description}`,
            printerId: item.printerId,
            filamentId: item.filamentId,
            filamentUsedGrams: item.filamentGrams,
            durationHours: item.printHours,
            status: 'queued',
            notes: `Originado do orçamento ${quote.id}`,
        }));
        setPrintJobs(prev => [...newJobs, ...prev]);
    } else {
        if (!window.confirm("Tem certeza que deseja rejeitar este orçamento?")) return;
    }

    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status } : q));
  };

  const handleDeleteQuote = (quoteId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.")) {
      setQuotes(prev => prev.filter(q => q.id !== quoteId));
    }
  };


  return (
    <>
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex justify-end items-center mb-6">
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition">
          <PlusIcon className="h-5 w-5 mr-2" />
          Novo Orçamento
        </button>
      </div>

      <h3 className="text-lg font-semibold text-gray-200 mb-4">Orçamentos Recentes</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-700/50 text-sm text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-6 font-medium">Data</th>
              <th className="py-3 px-6 font-medium">Cliente</th>
              <th className="py-3 px-6 font-medium">Status</th>
              <th className="py-3 px-6 font-medium text-right">Valor Total</th>
              <th className="py-3 px-6 font-medium text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {quotes.length > 0 ? (
              quotes.map(quote => (
                <tr key={quote.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-4 px-6">{formatDate(quote.date)}</td>
                  <td className="py-4 px-6 font-medium">{quote.customerName}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusClass(quote.status)}`}>
                        {quote.status === 'pending' ? 'Pendente' : quote.status === 'accepted' ? 'Aceito' : 'Rejeitado'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-semibold">{formatCurrency(quote.totalPrice)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-3">
                        {quote.status === 'pending' ? (
                            <>
                                <button onClick={() => handleUpdateQuoteStatus(quote.id, 'accepted')} className="text-green-400 hover:text-green-300" title="Aceitar Orçamento">
                                    <CheckCircleIcon className="w-6 h-6" />
                                </button>
                                <button onClick={() => handleUpdateQuoteStatus(quote.id, 'rejected')} className="text-yellow-400 hover:text-yellow-300" title="Rejeitar Orçamento">
                                    <XCircleIcon className="w-6 h-6" />
                                </button>
                            </>
                        ) : (<div className="w-12"></div>)}
                         <button onClick={() => handleDeleteQuote(quote.id)} className="text-red-400 hover:text-red-300" title="Excluir Orçamento">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-20 text-gray-500">
                    <FileTextIcon className="h-16 w-16 mx-auto text-gray-600" />
                    <h3 className="mt-2 text-lg font-medium">Nenhum orçamento criado</h3>
                    <p className="text-sm">Crie um orçamento para seus clientes.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    {isModalOpen && <QuoteCalculatorModal onClose={() => setIsModalOpen(false)} onSave={handleSaveQuote} settings={settings} filaments={filaments} printers={printers} />}
    </>
  );
};

export default QuotesPage;
