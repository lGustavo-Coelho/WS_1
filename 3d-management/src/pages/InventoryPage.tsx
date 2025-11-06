import React, { useState, useMemo, useEffect } from 'react';
import { Product, Filament, Settings, Printer } from '../types';
import { PlusIcon, EditIcon, TrashIcon, PackageIcon, ImageIcon } from '../components/Icons';

const calculateProductCost = (
    productData: Partial<Product>,
    filaments: Filament[],
    printers: Printer[],
    settings: Settings
): number => {
    const filament = filaments.find(f => f.id === productData.filamentId);
    const printer = printers.find(p => p.id === productData.printerId);

    if (!filament || !printer || !productData.filamentUsedGrams || !productData.printingTimeHours) {
        return 0;
    }

    const filamentCost = (productData.filamentUsedGrams / 1000) * filament.costPerKg;
    const energyCost = productData.printingTimeHours * printer.powerConsumptionKW * settings.kwhCost;
    const depreciationCost = productData.printingTimeHours * printer.hourlyDepreciation;

    return filamentCost + energyCost + depreciationCost;
};


interface ProductFormModalProps {
    product: Product | null;
    onSave: (product: Product) => void;
    onClose: () => void;
    filaments: Filament[];
    printers: Printer[];
    settings: Settings;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onSave, onClose, filaments, printers, settings }) => {
    const [formData, setFormData] = useState<Omit<Product, 'id'>>(
        product || {
            name: '',
            description: '',
            price: 0,
            stock: 0,
            filamentUsedGrams: 0,
            printingTimeHours: 0,
            filamentId: filaments[0]?.id || '',
            printerId: printers[0]?.id || '',
            imageUrl: '',
        }
    );
    
    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: settings.currency }).format(value);

    const productionCost = useMemo(() => calculateProductCost(formData, filaments, printers, settings), [formData, filaments, printers, settings]);
    const suggestedPrice = useMemo(() => productionCost * (1 + settings.profitMargin / 100), [productionCost, settings.profitMargin]);

    useEffect(() => {
      // Auto-update price if it's 0 or matches the old suggested price
      if (suggestedPrice > 0 && (formData.price === 0 || !product)) {
         setFormData(prev => ({ ...prev, price: suggestedPrice }));
      }
    }, [suggestedPrice, product, formData.price]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev };
            const numericFields = ['price', 'stock', 'filamentUsedGrams', 'printingTimeHours'];

            if (numericFields.includes(name)) {
                newState[name as 'price' | 'stock' | 'filamentUsedGrams' | 'printingTimeHours'] = parseFloat(value) || 0;
            } else {
                newState[name as 'name' | 'description' | 'imageUrl' | 'filamentId' | 'printerId'] = value;
            }
            return newState;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productToSave = { ...formData, id: product?.id || `PROD-${Date.now()}` };
        onSave(productToSave);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-100">{product ? 'Editar Produto' : 'Adicionar Produto'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Nome do Produto</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Descrição</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">URL da Imagem (Opcional)</label>
                                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Estoque Inicial</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="mt-1" />
                                </div>
                            </div>
                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                                    <h3 className="font-semibold text-gray-200 mb-2">Detalhes de Produção</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><label className="text-xs font-medium text-gray-400">Filamento (g)</label><input type="number" name="filamentUsedGrams" value={formData.filamentUsedGrams} onChange={handleChange} className="mt-1 text-sm" /></div>
                                        <div><label className="text-xs font-medium text-gray-400">Tempo (h)</label><input type="number" step="0.1" name="printingTimeHours" value={formData.printingTimeHours} onChange={handleChange} className="mt-1 text-sm" /></div>
                                        <div><label className="text-xs font-medium text-gray-400">Filamento</label><select name="filamentId" value={formData.filamentId} onChange={handleChange} className="mt-1 text-sm"><option value="">Selecione</option>{filaments.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
                                        <div><label className="text-xs font-medium text-gray-400">Impressora</label><select name="printerId" value={formData.printerId} onChange={handleChange} className="mt-1 text-sm"><option value="">Selecione</option>{printers.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                                    </div>
                                </div>

                                <div className="p-4 bg-emerald-900/20 border border-emerald-800 rounded-lg space-y-2">
                                    <h3 className="font-semibold text-gray-200">Precificação</h3>
                                    <div className="flex justify-between text-sm"><span className="text-gray-400">Custo de Produção Estimado:</span><span className="font-bold text-gray-200">{formatCurrency(productionCost)}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-gray-400">Preço Sugerido (+{settings.profitMargin}%):</span><span className="font-bold text-gray-200">{formatCurrency(suggestedPrice)}</span></div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">Preço de Venda Final</label>
                                        <div className="relative mt-1">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-gray-400 sm:text-sm">R$</span></div>
                                            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="pl-10" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold rounded-md transition">Cancelar</button>
                        <button type="submit" className="py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition">Salvar Produto</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


interface InventoryPageProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  filaments: Filament[];
  printers: Printer[];
  settings: Settings;
}

const InventoryPage: React.FC<InventoryPageProps> = ({ products, setProducts, filaments, printers, settings }) => {
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
  }, [products, filter]);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: settings.currency }).format(value);

  const openModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };
  
  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
        setProducts(prev => [product, ...prev]);
    }
    closeModal();
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
        setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  return (
    <>
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input 
          type="text" 
          placeholder="Filtrar por nome do produto..." 
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full md:w-72"
        />
        <button onClick={() => openModal()} className="w-full md:w-auto flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition">
            <PlusIcon className="h-5 w-5 mr-2" />
          Adicionar Produto
        </button>
      </div>

      <div className="overflow-x-auto">
          <table className="w-full text-left">
          <thead>
              <tr className="bg-gray-700/50 text-sm text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-6 font-medium">Produto</th>
                <th className="py-3 px-6 font-medium">Estoque</th>
                <th className="py-3 px-6 font-medium">Preço Unitário</th>
                <th className="py-3 px-6 font-medium">Custo Estimado</th>
                <th className="py-3 px-6 font-medium text-center">Ações</th>
              </tr>
          </thead>
          <tbody className="text-gray-300">
            {filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                    <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="py-4 px-6 font-medium text-gray-100">
                            <div className="flex items-center gap-4">
                               {p.imageUrl ? (
                                    <img src={p.imageUrl} alt={p.name} className="h-12 w-12 rounded-md object-cover" />
                                ) : (
                                    <div className="h-12 w-12 rounded-md bg-gray-700 flex items-center justify-center">
                                        <ImageIcon className="h-6 w-6 text-gray-500" />
                                    </div>
                                )}
                                <span>{p.name}</span>
                            </div>
                        </td>
                        <td className="py-4 px-6 font-semibold">{p.stock}</td>
                        <td className="py-4 px-6">{formatCurrency(p.price)}</td>
                        <td className="py-4 px-6">{formatCurrency(calculateProductCost(p, filaments, printers, settings))}</td>
                        <td className="py-4 px-6">
                            <div className="flex items-center justify-center space-x-3">
                                <button onClick={() => openModal(p)} className="text-blue-400 hover:text-blue-300"><EditIcon className="h-5 w-5" /></button>
                                <button onClick={() => handleDeleteProduct(p.id)} className="text-red-400 hover:text-red-300"><TrashIcon className="h-5 w-5" /></button>
                            </div>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-gray-500">
                    <PackageIcon className="h-16 w-16 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">Nenhum produto cadastrado</h3>
                    <p className="text-sm">Adicione produtos para gerenciar seu inventário.</p>
                  </td>
                </tr>
            )}
          </tbody>
          </table>
      </div>
    </div>
    {isModalOpen && <ProductFormModal product={editingProduct} onSave={handleSaveProduct} onClose={closeModal} filaments={filaments} printers={printers} settings={settings} />}
    </>
  );
};

export default InventoryPage;
