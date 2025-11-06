import React, { useState, useMemo } from 'react';
import { PrintJob, Printer, Filament, PrintJobStatus } from '../types';
import { PlusIcon, ClipboardListIcon, CheckCircleIcon, XCircleIcon } from '../components/Icons';

interface PrintJobFormModalProps {
  onSave: (job: Omit<PrintJob, 'id' | 'status' | 'startDate' | 'endDate'>) => void;
  onClose: () => void;
  printers: Printer[];
  filaments: Filament[];
}

const PrintJobFormModal: React.FC<PrintJobFormModalProps> = ({ onSave, onClose, printers, filaments }) => {
    const [formData, setFormData] = useState({
        name: '',
        printerId: '',
        filamentId: '',
        filamentUsedGrams: 0,
        durationHours: 0,
        notes: '',
    });
    
    const availablePrinters = useMemo(() => printers.filter(p => p.status === 'Ociosa'), [printers]);
    
    const selectedFilament = useMemo(() => filaments.find(f => f.id === formData.filamentId), [formData.filamentId, filaments]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev };
            if (name === 'filamentUsedGrams' || name === 'durationHours') {
                newState[name] = parseFloat(value) || 0;
            } else {
                newState[name as 'name' | 'printerId' | 'filamentId' | 'notes'] = value;
            }
            return newState;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.printerId || !formData.filamentId) {
            alert('Por favor, selecione uma impressora e um filamento.');
            return;
        }
        if (selectedFilament && selectedFilament.stock < formData.filamentUsedGrams) {
            alert(`Estoque de filamento insuficiente. Disponível: ${selectedFilament.stock}g`);
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Novo Trabalho de Impressão</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Nome do Trabalho</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Impressora</label>
                            <select name="printerId" value={formData.printerId} onChange={handleChange} className="mt-1" required>
                                <option value="">Selecione...</option>
                                {availablePrinters.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Filamento</label>
                            <select name="filamentId" value={formData.filamentId} onChange={handleChange} className="mt-1" required>
                                <option value="">Selecione...</option>
                                {filaments.map(f => <option key={f.id} value={f.id}>{f.name} ({f.stock}g)</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-300">Filamento a ser Usado (g)</label>
                            <input type="number" name="filamentUsedGrams" value={formData.filamentUsedGrams} onChange={handleChange} className="mt-1" required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-300">Duração Estimada (horas)</label>
                            <input type="number" step="0.1" name="durationHours" value={formData.durationHours} onChange={handleChange} className="mt-1" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Notas (Opcional)</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="mt-1"></textarea>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold rounded-md transition">Cancelar</button>
                        <button type="submit" className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition">Iniciar Trabalho</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


interface PrintJobsPageProps {
  printJobs: PrintJob[];
  setPrintJobs: React.Dispatch<React.SetStateAction<PrintJob[]>>;
  printers: Printer[];
  setPrinters: React.Dispatch<React.SetStateAction<Printer[]>>;
  filaments: Filament[];
  setFilaments: React.Dispatch<React.SetStateAction<Filament[]>>;
}

const PrintJobsPage: React.FC<PrintJobsPageProps> = ({ printJobs, setPrintJobs, printers, setPrinters, filaments, setFilaments }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusClass = (status: PrintJob['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'printing': return 'bg-blue-500/20 text-blue-300 animate-pulse';
      case 'failed':
      case 'cancelled': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getPrinterName = (id: string) => printers.find(p => p.id === id)?.name || 'N/A';
  const getFilamentName = (id: string) => filaments.find(f => f.id === id)?.name || 'N/A';

  const handleSaveJob = (jobData: Omit<PrintJob, 'id' | 'status' | 'startDate' | 'endDate'>) => {
    // 1. Create new job and add to state
    const newJob: PrintJob = {
        ...jobData,
        id: `JOB-${Date.now()}`,
        status: 'printing',
        startDate: new Date().toISOString()
    };
    setPrintJobs(prev => [newJob, ...prev]);

    // 2. Update printer status
    setPrinters(prevPrinters => prevPrinters.map(p => 
        p.id === newJob.printerId ? { ...p, status: 'Imprimindo' } : p
    ));

    setIsModalOpen(false);
  };
  
  const updateJobStatus = (jobId: string, newStatus: Extract<PrintJobStatus, 'completed' | 'failed' | 'cancelled'>) => {
    const job = printJobs.find(j => j.id === jobId);
    if (!job) return;

    // 1. Update job status and end date
    setPrintJobs(prev => prev.map(j => 
        j.id === jobId ? { ...j, status: newStatus, endDate: new Date().toISOString() } : j
    ));

    // 2. Update printer status back to idle and add printed hours
    setPrinters(prev => prev.map(p => 
        p.id === job.printerId 
            ? { 
                ...p, 
                status: 'Ociosa', 
                printedHours: newStatus === 'completed' ? p.printedHours + job.durationHours : p.printedHours 
              } 
            : p
    ));

    // 3. If completed, update filament stock
    if (newStatus === 'completed') {
        setFilaments(prev => prev.map(f => 
            f.id === job.filamentId ? { ...f, stock: f.stock - job.filamentUsedGrams } : f
        ));
    }
  };


  return (
    <>
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex justify-end items-center mb-6">
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition">
          <PlusIcon className="h-5 w-5 mr-2" />
          Novo Trabalho
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-700/50 text-sm text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-6 font-medium">Trabalho</th>
              <th className="py-3 px-6 font-medium">Impressora</th>
              <th className="py-3 px-6 font-medium">Filamento</th>
              <th className="py-3 px-6 font-medium">Status</th>
              <th className="py-3 px-6 font-medium">Início</th>
              <th className="py-3 px-6 font-medium text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {printJobs.length > 0 ? (
              printJobs.map(job => (
                <tr key={job.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-200">{job.name}</p>
                    <p className="text-xs text-gray-400">{job.durationHours}h / {job.filamentUsedGrams}g</p>
                  </td>
                  <td className="py-4 px-6">{getPrinterName(job.printerId)}</td>
                  <td className="py-4 px-6">{getFilamentName(job.filamentId)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusClass(job.status)}`}>
                      {job.status === 'printing' ? 'Imprimindo' : job.status === 'completed' ? 'Concluído' : job.status === 'queued' ? 'Em Fila' : job.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm">{job.startDate ? new Date(job.startDate).toLocaleString('pt-BR') : 'N/A'}</td>
                  <td className="py-4 px-6 text-center">
                    {job.status === 'printing' || job.status === 'queued' ? (
                        <div className="flex items-center justify-center space-x-2">
                           <button onClick={() => updateJobStatus(job.id, 'completed')} className="text-green-400 hover:text-green-300" title="Marcar como Concluído">
                               <CheckCircleIcon className="h-6 w-6" />
                           </button>
                           <button onClick={() => updateJobStatus(job.id, 'cancelled')} className="text-red-400 hover:text-red-300" title="Cancelar Trabalho">
                               <XCircleIcon className="h-6 w-6" />
                           </button>
                        </div>
                    ) : (
                        <span className="text-gray-500 text-sm">--</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-20 text-gray-500">
                  <ClipboardListIcon className="h-16 w-16 mx-auto text-gray-600" />
                  <h3 className="mt-2 text-lg font-medium">Nenhum trabalho de impressão</h3>
                  <p className="text-sm">Adicione um novo trabalho para começar.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    {isModalOpen && <PrintJobFormModal onSave={handleSaveJob} onClose={() => setIsModalOpen(false)} printers={printers} filaments={filaments} />}
    </>
  );
};

export default PrintJobsPage;
