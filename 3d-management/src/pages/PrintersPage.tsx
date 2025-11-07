import React, { useEffect, useMemo, useState } from 'react';
import { Printer, PrinterStatus, Transaction } from '../types';
import { PlusIcon, EditIcon, TrashIcon, PrinterIcon } from '../components/Icons';
import { dataService } from '../services/dataService';
import { useAppStore } from '../store/appStore';
import { logger } from '../utils/logger';

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: 'UTC',
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const formatDateInput = (value?: string) => {
  if (!value) {
    return new Date().toISOString().split('T')[0];
  }
  return value.split('T')[0];
};

const UsefulLifeInfoModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4" onClick={onClose}>
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(event) => event.stopPropagation()}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-100">Guia de Vida Útil de Impressoras 3D</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-3xl">&times;</button>
      </div>
      <div className="overflow-y-auto space-y-4 pr-2 text-sm text-gray-300">
        <div className="bg-blue-900/50 border border-blue-700 text-blue-200 p-3 rounded-md">
          <strong>Importante:</strong> A vida útil depende do tipo de impressora. Para impressoras FDM, a durabilidade está ligada à manutenção preventiva. Nas impressoras de resina, a tela LCD costuma definir o ciclo de substituição.
        </div>
        <div>
          <h4 className="font-bold text-gray-200 mb-2">Impressoras de Resina (MSLA)</h4>
          <p className="mb-2">A tela LCD monocromática é o ponto crítico dessas impressoras.</p>
          <ul className="space-y-1 list-disc list-inside text-gray-400">
            <li>Elegoo Saturn / Anycubic Photon / Creality Halot: ~2.000 horas</li>
            <li>Após esse período, substitua a tela para manter a qualidade.</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-200 mb-2">Impressoras de Filamento (FDM)</h4>
          <p className="mb-2">A estrutura pode durar muitos anos com manutenção periódica:</p>
          <ul className="space-y-1 list-disc list-inside text-gray-400">
            <li>Creality Ender 3: 1.500 – 5.000+ horas</li>
            <li>Bambu Lab: 4.000 – 8.000+ horas</li>
            <li>Prusa i3: 5.000 – 10.000+ horas</li>
          </ul>
        </div>
      </div>
      <div className="flex justify-end mt-4 pt-4 border-t border-gray-700">
        <button onClick={onClose} className="py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition">Fechar</button>
      </div>
    </div>
  </div>
);

interface PrinterFormModalProps {
  printer: Printer | null;
  onSave: (printer: Printer) => Promise<void>;
  onClose: () => void;
  onOpenInfo: () => void;
}

const PrinterFormModal: React.FC<PrinterFormModalProps> = ({ printer, onSave, onClose, onOpenInfo }) => {
  const buildInitialState = () => ({
    name: printer?.name ?? '',
    model: printer?.model ?? '',
    status: (printer?.status as PrinterStatus) ?? 'Ociosa',
    nozzle_size: printer?.nozzle_size ?? 0.4,
    power_consumption: printer?.power_consumption ?? 0,
    purchase_price: printer?.purchase_price ?? 0,
    purchase_date: formatDateInput(printer?.purchase_date),
    total_print_hours: printer?.total_print_hours ?? 0,
    maintenance_history: printer?.maintenance_history ?? '',
    notes: printer?.notes ?? '',
  });

  const [formData, setFormData] = useState<Omit<Printer, 'id' | 'created_at' | 'updated_at'>>(buildInitialState);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(buildInitialState());
  }, [printer?.id]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => {
      if (['nozzle_size', 'power_consumption', 'purchase_price', 'total_print_hours'].includes(name)) {
        return { ...previous, [name]: Number(value) || 0 } as typeof previous;
      }
      return { ...previous, [name]: value } as typeof previous;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const printerToSave: Printer = {
        id: printer?.id ?? `PRN-${Date.now()}`,
        ...formData,
        purchase_date: formData.purchase_date || undefined,
      };

      await onSave(printerToSave);
    } catch (error) {
      logger.error('Failed to submit printer form', { error });
      alert('Erro ao salvar impressora');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 w-full max-w-2xl" onClick={(event) => event.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-100 mb-6">{printer ? 'Editar Impressora' : 'Adicionar Impressora'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Nome</label>
              <input type="text" name="name" value={formData.name} onChange={handleTextChange} placeholder="Ex: Ender 3 V2" className="mt-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Modelo</label>
              <input type="text" name="model" value={formData.model} onChange={handleTextChange} placeholder="Ex: Creality" className="mt-1" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Status</label>
              <select name="status" value={formData.status} onChange={handleTextChange} className="mt-1">
                <option value="Ociosa">Ociosa</option>
                <option value="Imprimindo">Imprimindo</option>
                <option value="Em Manutenção">Em Manutenção</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Bico (mm)</label>
              <input type="number" step="0.01" name="nozzle_size" value={formData.nozzle_size} onChange={handleTextChange} className="mt-1" min={0} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Consumo de Energia (W)</label>
              <input type="number" name="power_consumption" value={formData.power_consumption} onChange={handleTextChange} className="mt-1" min={0} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Horas Impressas</label>
              <input type="number" name="total_print_hours" value={formData.total_print_hours} onChange={handleTextChange} className="mt-1" min={0} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Valor de Compra (R$)</label>
              <input type="number" step="0.01" name="purchase_price" value={formData.purchase_price} onChange={handleTextChange} className="mt-1" min={0} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Data de Compra</label>
              <div className="relative">
                <input type="date" name="purchase_date" value={formData.purchase_date || ''} onChange={handleTextChange} className="mt-1 w-full" />
                <button
                  type="button"
                  onClick={onOpenInfo}
                  className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-gray-400 hover:text-emerald-400"
                >
                  <span className="text-xl font-bold">?</span>
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Histórico de Manutenção</label>
            <textarea name="maintenance_history" value={formData.maintenance_history} onChange={handleTextChange} className="mt-1 w-full h-20" placeholder="Anote manutenções relevantes..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Notas</label>
            <textarea name="notes" value={formData.notes} onChange={handleTextChange} className="mt-1 w-full h-20" placeholder="Observações gerais" />
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

interface PrintersPageProps {
  printers: Printer[];
  setPrinters: React.Dispatch<React.SetStateAction<Printer[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const PrintersPage: React.FC<PrintersPageProps> = ({ printers, setPrinters, setTransactions }) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<Printer | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | PrinterStatus>('all');
  const { setLoading, setError } = useAppStore();

  useEffect(() => {
    const loadPrinters = async () => {
      setLoading(true);
      try {
        const data = await dataService.getPrinters();
        setPrinters(data);
        setError(null);
      } catch (error) {
        logger.error('Failed to load printers', { error });
        setError('Erro ao carregar impressoras');
      } finally {
        setLoading(false);
      }
    };

    if (printers.length === 0) {
      loadPrinters();
    }
  }, []);

  const filteredPrinters = useMemo(() => {
    if (statusFilter === 'all') {
      return printers;
    }
    return printers.filter((printer) => printer.status === statusFilter);
  }, [printers, statusFilter]);

  const handleSavePrinter = async (printer: Printer) => {
    setLoading(true);
    try {
      if (editingPrinter) {
        const updated = await dataService.updatePrinter(printer.id, printer);
        setPrinters((previous) => previous.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await dataService.createPrinter(printer);
        setPrinters((previous) => [...previous, created]);

        if (created.purchase_price && created.purchase_price > 0) {
          const transaction: Transaction = {
            id: `TRN-PRN-${Date.now()}`,
            date: new Date(created.purchase_date ?? new Date().toISOString()).toISOString(),
            description: `Compra de impressora: ${created.name}`,
            amount: created.purchase_price,
            type: 'expense',
            category: 'Compra de Equipamento',
          };
          setTransactions((previous) => [transaction, ...previous]);
        }
      }

      setError(null);
      setIsFormModalOpen(false);
      setEditingPrinter(null);
    } catch (error) {
      logger.error('Failed to persist printer', { error });
      setError('Erro ao salvar impressora');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrinter = async (printerId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta impressora?')) {
      return;
    }

    setLoading(true);
    try {
      await dataService.deletePrinter(printerId);
      setPrinters((previous) => previous.filter((printer) => printer.id !== printerId));
      setError(null);
    } catch (error) {
      logger.error('Failed to delete printer', { error });
      setError('Erro ao excluir impressora');
      alert('Erro ao excluir impressora');
    } finally {
      setLoading(false);
    }
  };

  const openFormModal = (printer: Printer | null = null) => {
    setEditingPrinter(printer);
    setIsFormModalOpen(true);
  };

  const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString('pt-BR', DATE_FORMAT_OPTIONS) : '—');

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'all' | PrinterStatus)}
          className="w-full md:w-48"
        >
          <option value="all">Todos os Status</option>
          <option value="Ociosa">Ociosa</option>
          <option value="Imprimindo">Imprimindo</option>
          <option value="Em Manutenção">Em Manutenção</option>
          <option value="Offline">Offline</option>
        </select>
        <button
          onClick={() => openFormModal()}
          className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
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
              <th className="py-3 px-6 font-medium">Consumo</th>
              <th className="py-3 px-6 font-medium">Valor</th>
              <th className="py-3 px-6 font-medium">Data Compra</th>
              <th className="py-3 px-6 font-medium">Horas</th>
              <th className="py-3 px-6 font-medium text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {filteredPrinters.length > 0 ? (
              filteredPrinters.map((printer) => (
                <tr key={printer.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-4 px-6 font-medium text-gray-100">{printer.name}</td>
                  <td className="py-4 px-6">{printer.model}</td>
                  <td className="py-4 px-6">{printer.status}</td>
                  <td className="py-4 px-6">{printer.power_consumption ? `${printer.power_consumption} W` : '—'}</td>
                  <td className="py-4 px-6">{printer.purchase_price ? currencyFormatter.format(printer.purchase_price) : '—'}</td>
                  <td className="py-4 px-6">{formatDate(printer.purchase_date)}</td>
                  <td className="py-4 px-6">{printer.total_print_hours}h</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-3">
                      <button onClick={() => openFormModal(printer)} className="text-blue-400 hover:text-blue-300">
                        <EditIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDeletePrinter(printer.id)} className="text-red-400 hover:text-red-300">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-20 text-gray-500">
                  <PrinterIcon className="h-16 w-16 mx-auto text-gray-600" />
                  <h3 className="mt-2 text-lg font-medium">Nenhuma impressora cadastrada</h3>
                  <p className="text-sm">Cadastre sua primeira impressora para acompanhar produção e custos.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormModalOpen && (
        <PrinterFormModal
          printer={editingPrinter}
          onSave={handleSavePrinter}
          onClose={() => setIsFormModalOpen(false)}
          onOpenInfo={() => setIsInfoModalOpen(true)}
        />
      )}
      {isInfoModalOpen && <UsefulLifeInfoModal onClose={() => setIsInfoModalOpen(false)} />}
    </div>
  );
};

export default PrintersPage;
