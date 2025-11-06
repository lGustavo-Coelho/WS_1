import React, { useState } from 'react';
import { Printer, PrinterStatus, Transaction } from '../types';
import { PlusIcon, EditIcon, TrashIcon, PrinterIcon } from '../components/Icons';

// Sub-component for the "Useful Life Guide" modal
const UsefulLifeInfoModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-100">Guia de Vida Útil de Impressoras 3D</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-3xl">&times;</button>
                </div>
                <div className="overflow-y-auto space-y-4 pr-2 text-sm text-gray-300">
                    <div className="bg-blue-900/50 border border-blue-700 text-blue-200 p-3 rounded-md">
                        <strong>Importante:</strong> A "vida útil" de uma impressora 3D é um conceito flexível. Para impressoras FDM, a estrutura pode durar muitos anos, sendo mais uma questão de substituir peças desgastadas. Para impressoras de resina (MSLA), a vida útil é frequentemente ditada pela durabilidade de seu LCD.
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-gray-200 mb-2">Impressoras 3D de Resina (Vida Útil da Tela LCD)</h4>
                        <p className="mb-2">A vida útil de muitas impressoras de resina é definida pela tela LCD monocromática, que é a peça responsável por curar a resina.</p>
                        <table className="w-full text-left border-collapse border border-gray-700">
                            <thead><tr className="bg-gray-700"><th className="border border-gray-600 p-2">MODELO</th><th className="border border-gray-600 p-2">COMPONENTE CHAVE</th><th className="border border-gray-600 p-2">ESTIMATIVA DE VIDA ÚTIL</th></tr></thead>
                            <tbody>
                                <tr className="bg-gray-800"><td className="border border-gray-600 p-2">Elegoo Saturn (2, S, 3 Ultra)</td><td className="border border-gray-600 p-2">Tela LCD Monocromática</td><td className="border border-gray-600 p-2">~2.000 horas</td></tr>
                                <tr className="bg-gray-800"><td className="border border-gray-600 p-2">Anycubic Photon (Mono X/SE, M3)</td><td className="border border-gray-600 p-2">Tela LCD Monocromática</td><td className="border border-gray-600 p-2">~2.000 horas</td></tr>
                                <tr className="bg-gray-800"><td className="border border-gray-600 p-2">Creality Halot (Mage/Sky/Pro)</td><td className="border border-gray-600 p-2">Tela LCD Monocromática</td><td className="border border-gray-600 p-2">~2.000 horas</td></tr>
                            </tbody>
                        </table>
                        <div className="mt-2 bg-yellow-900/50 border border-yellow-700 text-yellow-200 p-3 rounded-md">
                            <strong>Observação:</strong> Vida atingir esse tempo, a tela LCD pode começar a apresentar falhas em pixels, afetando a qualidade da impressão, e precisará ser substituída.
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-200 mb-2">Impressoras 3D de Filamento (FDM)</h4>
                        <p className="mb-2">Para impressoras FDM, a estimativa em horas é menos direta, pois diferentes partes se desgastam em ritmos diferentes. A "vida útil" geralmente se refere ao ponto em que reparos mais significativos podem ser necessários.</p>
                         <table className="w-full text-left border-collapse border border-gray-700">
                            <thead><tr className="bg-gray-700"><th className="border border-gray-600 p-2">MODELO</th><th className="border border-gray-600 p-2">ESTIMATIVA DE VIDA ÚTIL</th><th className="border border-gray-600 p-2">CONSERVAÇÕES</th></tr></thead>
                            <tbody>
                                <tr className="bg-gray-800"><td className="border border-gray-600 p-2">Creality Ender 3 (V2, V3 SE, S1)</td><td className="border border-gray-600 p-2">~1.500 a 5.000+ horas</td><td className="border border-gray-600 p-2">Altamente modular. Peças como bico (100-300h), tubo de PTFE e a correia são trocadas regularmente.</td></tr>
                                <tr className="bg-gray-800"><td className="border border-gray-600 p-2">Bambu Lab (P1S, A1 Mini, X1C)</td><td className="border border-gray-600 p-2">~4.000 a 8.000+ horas</td><td className="border border-gray-600 p-2">Construção de alta qualidade com componentes duráveis. Projetada para alta velocidade e uso prolongado.</td></tr>
                                <tr className="bg-gray-800"><td className="border border-gray-600 p-2">Prusa i3 (MK3/MK4)</td><td className="border border-gray-600 p-2">~5.000 a 10.000+ horas</td><td className="border border-gray-600 p-2">Conhecida pelo sistema robusto, componentes de alta qualidade e confiabilidade excepcional.</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-green-900/50 border border-green-700 text-green-200 p-3 rounded-md">
                        <strong>Resumo:</strong> Enquanto impressoras de resina têm um ciclo de vida mais previsível devido à tela LCD, as impressoras FDM são como carros: com a manutenção adequada e substituição de peças, elas podem continuar funcionando por um tempo quase ilimitado. As estimativas em horas para elas representam mais um ciclo de uso intenso antes da necessidade de uma revisão mais aprofundada.
                    </div>
                </div>
                <div className="flex justify-end mt-4 pt-4 border-t border-gray-700">
                    <button onClick={onClose} className="py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition">Fechar</button>
                </div>
            </div>
        </div>
    );
};


// Sub-component for the Add/Edit Printer form modal
interface PrinterFormModalProps {
  printer: Printer | null;
  onSave: (printer: Printer, isNew: boolean) => void;
  onClose: () => void;
  onOpenInfo: () => void;
}

const PrinterFormModal: React.FC<PrinterFormModalProps> = ({ printer, onSave, onClose, onOpenInfo }) => {
  const [formData, setFormData] = useState<Omit<Printer, 'id' | 'powerConsumptionKW' | 'hourlyDepreciation'>>(
    printer || {
      name: '', model: '', status: 'Ociosa' as PrinterStatus, nozzleSize: 0.4,
      purchaseValue: undefined, lifespanHours: undefined, powerConsumptionWatts: undefined,
      purchaseDate: new Date().toISOString().split('T')[0],
      printedHours: 0
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newState = { ...prev };
        switch (name) {
            case 'nozzleSize':
                newState[name] = parseFloat(value) || 0;
                break;
            case 'purchaseValue':
            case 'lifespanHours':
            case 'powerConsumptionWatts':
                newState[name] = value === '' ? undefined : parseFloat(value);
                break;
            case 'status':
                newState[name] = value as PrinterStatus;
                break;
            case 'name':
            case 'model':
                newState[name] = value;
                break;
            case 'purchaseDate':
                newState[name] = value || '';
                break;
        }
        return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !printer;
    const powerConsumptionKW = (formData.powerConsumptionWatts || 0) / 1000;
    const hourlyDepreciation = (formData.purchaseValue && formData.lifespanHours) ? formData.purchaseValue / formData.lifespanHours : 0;
    
    const printerToSave: Printer = {
        ...formData,
        id: printer?.id || `PRN-${Date.now()}`,
        powerConsumptionKW,
        hourlyDepreciation,
        nozzleSize: formData.nozzleSize || 0,
        printedHours: printer?.printedHours || 0
    };
    onSave(printerToSave, isNew);
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-100 mb-6">{printer ? 'Editar Impressora' : 'Adicionar Impressora'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Nome da Impressora</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Ender 3 V2" className="mt-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Modelo</label>
              <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Ex: Creality" className="mt-1" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-300">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="mt-1">
                    <option>Ociosa</option><option>Imprimindo</option><option>Em Manutenção</option><option>Offline</option>
                </select>
             </div>
             <div>
              <label className="block text-sm font-medium text-gray-300">Tamanho do Bico (mm)</label>
              <input type="number" step="0.01" name="nozzleSize" value={formData.nozzleSize} onChange={handleChange} className="mt-1" />
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-300">Valor de Compra (R$)</label>
              <input type="number" step="0.01" name="purchaseValue" value={formData.purchaseValue || ''} onChange={handleChange} placeholder="Opcional: ex: 1500,00" className="mt-1" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-300">Vida Útil (Horas)</label>
                <div className="relative">
                    <input type="number" name="lifespanHours" value={formData.lifespanHours || ''} onChange={handleChange} placeholder="Opcional: ex: 5000" className="mt-1" />
                    <button type="button" onClick={onOpenInfo} className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-gray-400 hover:text-emerald-400">
                        <span className="text-xl font-bold">?</span>
                    </button>
                </div>
             </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-300">Consumo de Energia (Watts)</label>
              <input type="number" name="powerConsumptionWatts" value={formData.powerConsumptionWatts || ''} onChange={handleChange} placeholder="Opcional: ex: 350" className="mt-1" />
             </div>
             <div>
              <label className="block text-sm font-medium text-gray-300">Data da Compra (Opcional)</label>
              <input type="date" name="purchaseDate" value={formData.purchaseDate || ''} onChange={handleChange} className="mt-1" />
             </div>
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


// Main Page Component
interface PrintersPageProps {
    printers: Printer[];
    setPrinters: React.Dispatch<React.SetStateAction<Printer[]>>;
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const PrintersPage: React.FC<PrintersPageProps> = ({ printers, setPrinters, setTransactions }) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<Printer | null>(null);

  const handleSavePrinter = (printer: Printer, isNew: boolean) => {
    if (isNew) {
      setPrinters(prev => [printer, ...prev]);
      if (printer.purchaseValue && printer.purchaseValue > 0) {
        const newTransaction: Transaction = {
          id: `TRN-PRT-${Date.now()}`,
          date: new Date(printer.purchaseDate || Date.now()).toISOString(),
          description: `Compra de impressora: ${printer.name}`,
          amount: printer.purchaseValue,
          type: 'expense',
          category: 'Compra de Equipamento',
        };
        setTransactions(prev => [newTransaction, ...prev]);
      }
    } else {
      setPrinters(prev => prev.map(p => p.id === printer.id ? printer : p));
    }
    closeFormModal();
  };

  const handleDeletePrinter = (printerId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta impressora?')) {
      setPrinters(prev => prev.filter(p => p.id !== printerId));
    }
  };

  const openFormModal = (printer: Printer | null = null) => {
    setEditingPrinter(printer);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setEditingPrinter(null);
    setIsFormModalOpen(false);
  };
  
  const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A';
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex justify-end items-center mb-6">
        <button onClick={() => openFormModal()} className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition">
            <PlusIcon className="h-5 w-5 mr-2" />
            Adicionar Impressora
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-700/50 text-sm text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-6 font-medium">Nome</th>
              <th className="py-3 px-6 font-medium">Modelo</th>
              <th className="py-3 px-6 font-medium">Status</th>
              <th className="py-3 px-6 font-medium">Data Compra</th>
              <th className="py-3 px-6 font-medium">Horas Impressas</th>
              <th className="py-3 px-6 font-medium text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {printers.length > 0 ? (
              printers.map(p => (
                <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-4 px-6 font-medium text-gray-100">{p.name}</td>
                  <td className="py-4 px-6">{p.model}</td>
                  <td className="py-4 px-6">{p.status}</td>
                  <td className="py-4 px-6">{formatDate(p.purchaseDate)}</td>
                  <td className="py-4 px-6">{p.printedHours}h</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-3">
                      <button onClick={() => openFormModal(p)} className="text-blue-400 hover:text-blue-300"><EditIcon className="h-5 w-5" /></button>
                      <button onClick={() => handleDeletePrinter(p.id)} className="text-red-400 hover:text-red-300"><TrashIcon className="h-5 w-5" /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-gray-500">
                    <PrinterIcon className="h-16 w-16 mx-auto text-gray-600" />
                    <h3 className="mt-2 text-lg font-medium">Nenhuma impressora cadastrada</h3>
                    <p className="text-sm">Adicione sua primeira impressora para começar.</p>
                  </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormModalOpen && <PrinterFormModal printer={editingPrinter} onSave={handleSavePrinter} onClose={closeFormModal} onOpenInfo={() => setIsInfoModalOpen(true)} />}
      {isInfoModalOpen && <UsefulLifeInfoModal onClose={() => setIsInfoModalOpen(false)} />}
    </div>
  );
};

export default PrintersPage;
