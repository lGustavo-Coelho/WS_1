import React, { useState } from 'react';
import { useFilaments } from '../hooks/useFilaments';
import { Filament } from '../types';

const FilamentsPageV2: React.FC = () => {
  const { filaments, loading, error, create, update, remove } = useFilaments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFilament, setEditingFilament] = useState<Filament | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'PLA',
    color: '',
    brand: '',
    cost_per_kg: 0,
    stock_kg: 0,
    density: 1.24,
    supplier: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFilament) {
        await update(editingFilament.id, formData);
      } else {
        await create(formData);
      }
      closeModal();
    } catch (err) {
      console.error('Failed to save filament:', err);
    }
  };

  const openModal = (filament?: Filament) => {
    if (filament) {
      setEditingFilament(filament);
      setFormData({
        name: filament.name,
        type: filament.type,
        color: filament.color,
        brand: filament.brand,
        cost_per_kg: filament.cost_per_kg,
        stock_kg: filament.stock_kg,
        density: filament.density,
        supplier: filament.supplier || '',
        notes: filament.notes || '',
      });
    } else {
      setEditingFilament(null);
      setFormData({
        name: '',
        type: 'PLA',
        color: '',
        brand: '',
        cost_per_kg: 0,
        stock_kg: 0,
        density: 1.24,
        supplier: '',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFilament(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este filamento?')) {
      try {
        await remove(id);
      } catch (err) {
        console.error('Failed to delete filament:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Carregando filamentos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciar Filamentos</h2>
          <p className="text-gray-400 mt-1">Controle seu estoque de filamentos</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Adicionar Filamento
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Total de Filamentos</div>
          <div className="text-2xl font-bold text-white mt-1">{filaments.length}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Estoque Total (kg)</div>
          <div className="text-2xl font-bold text-white mt-1">
            {filaments.reduce((sum, f) => sum + f.stock_kg, 0).toFixed(2)}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Valor em Estoque</div>
          <div className="text-2xl font-bold text-white mt-1">
            R$ {filaments.reduce((sum, f) => sum + f.stock_kg * f.cost_per_kg, 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Nome
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Cor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Marca
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase">
                Estoque (kg)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase">
                Custo/kg
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filaments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Nenhum filamento cadastrado. Clique em "Adicionar Filamento" para começar.
                </td>
              </tr>
            ) : (
              filaments.map((filament) => (
                <tr key={filament.id} className="hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-white">{filament.name}</td>
                  <td className="px-4 py-3 text-gray-300">{filament.type}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-gray-600"
                        style={{ backgroundColor: filament.color.toLowerCase() }}
                      />
                      <span className="text-gray-300">{filament.color}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{filament.brand}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`${
                        filament.stock_kg < 1 ? 'text-red-400' : 'text-gray-300'
                      }`}
                    >
                      {filament.stock_kg.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">
                    R$ {filament.cost_per_kg.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openModal(filament)}
                      className="text-blue-400 hover:text-blue-300 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(filament.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                {editingFilament ? 'Editar Filamento' : 'Adicionar Filamento'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Tipo *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="PLA">PLA</option>
                      <option value="ABS">ABS</option>
                      <option value="PETG">PETG</option>
                      <option value="TPU">TPU</option>
                      <option value="Nylon">Nylon</option>
                      <option value="ASA">ASA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Cor *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Marca *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Estoque (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.stock_kg}
                      onChange={(e) =>
                        setFormData({ ...formData, stock_kg: parseFloat(e.target.value) })
                      }
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Custo por kg (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.cost_per_kg}
                      onChange={(e) =>
                        setFormData({ ...formData, cost_per_kg: parseFloat(e.target.value) })
                      }
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Densidade (g/cm³)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.density}
                      onChange={(e) =>
                        setFormData({ ...formData, density: parseFloat(e.target.value) })
                      }
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Fornecedor
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    {editingFilament ? 'Salvar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilamentsPageV2;
