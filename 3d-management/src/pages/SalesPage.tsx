import React, { useState, useMemo } from 'react';
import { Sale, Product, Transaction, Settings, SaleItem } from '../types';
import { PlusIcon, ShoppingCartIcon, TrashIcon } from '../components/Icons';

interface SaleFormModalProps {
  products: Product[];
  settings: Settings;
  onClose: () => void;
  onSave: (sale: Omit<Sale, 'id'>) => void;
}

const SaleFormModal: React.FC<SaleFormModalProps> = ({ products, settings, onClose, onSave }) => {
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<SaleItem[]>([{ productId: '', quantity: 1, unitPrice: 0 }]);

  const availableProducts = useMemo(() => products.filter((product) => product.stock > 0), [products]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: settings.currency }).format(value);

  const handleItemChange = (index: number, field: keyof SaleItem, value: string | number) => {
    const newItems = [...items];
    const currentItem = newItems[index];

    if (field === 'productId') {
      const product = products.find((p) => p.id === value);
      currentItem.productId = value as string;
      currentItem.unitPrice = product?.price || 0;
      currentItem.quantity = 1;
    } else if (field === 'quantity') {
      const product = products.find((p) => p.id === currentItem.productId);
      const stock = product?.stock ?? 0;
      let newQuantity = Math.max(1, Number(value));
      if (newQuantity > stock) {
        alert(`Estoque insuficiente. Disponivel: ${stock}`);
        newQuantity = stock;
      }
      currentItem.quantity = newQuantity;
    }

    setItems(newItems);
  };

  const addItem = () => {
    setItems((prev) => [...prev, { productId: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const total = useMemo(() => items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0), [items]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (items.some((item) => !item.productId || item.quantity <= 0)) {
      alert('Por favor, selecione produtos e quantidades validos.');
      return;
    }

    onSave({
      date: new Date(date).toISOString(),
      customerName,
      items,
      total,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="flex w-full max-w-2xl flex-col rounded-lg border border-gray-700 bg-gray-900 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-100">Registrar Nova Venda</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Nome do Cliente (opcional)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Data da Venda</label>
                <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-1" />
              </div>
            </div>

            <h3 className="border-t border-gray-700 pt-4 text-sm font-semibold uppercase tracking-wide text-gray-300">
              Itens da Venda
            </h3>

            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 rounded-md bg-gray-800/80 p-3">
                <select
                  value={item.productId}
                  onChange={(event) => handleItemChange(index, 'productId', event.target.value)}
                  className="w-1/2"
                >
                  <option value="">Selecione um produto...</option>
                  {availableProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Estoque: {product.stock})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) => handleItemChange(index, 'quantity', Number(event.target.value))}
                  className="w-20"
                />

                <div className="flex-1 text-right text-sm text-gray-300">
                  {formatCurrency(item.unitPrice)} x {item.quantity} ={' '}
                  <strong>{formatCurrency(item.unitPrice * item.quantity)}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={items.length <= 1}
                  className="text-red-500 transition hover:text-red-600 disabled:text-gray-500"
                  aria-label="Remover item"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="flex items-center text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              <PlusIcon className="mr-1 h-4 w-4" />
              Adicionar Item
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-gray-800 bg-gray-900/80 px-6 py-4">
            <span className="text-lg font-semibold text-gray-200">Total</span>
            <span className="text-2xl font-extrabold text-emerald-400">{formatCurrency(total)}</span>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-800 bg-gray-900/60 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Salvar Venda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface SalesPageProps {
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  settings: Settings;
}

const SalesPage: React.FC<SalesPageProps> = ({ sales, setSales, products, setProducts, setTransactions, settings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: settings.currency }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

  const handleSaveSale = (saleData: Omit<Sale, 'id'>) => {
    const newSale: Sale = {
      ...saleData,
      id: `SALE-${Date.now()}`,
    };
    setSales((prev) => [newSale, ...prev]);

    setProducts((currentProducts) => {
      const updatedProducts = [...currentProducts];
      newSale.items.forEach((item) => {
        const productIndex = updatedProducts.findIndex((product) => product.id === item.productId);
        if (productIndex !== -1) {
          updatedProducts[productIndex].stock -= item.quantity;
        }
      });
      return updatedProducts;
    });

    const newTransaction: Transaction = {
      id: `TRN-SALE-${newSale.id}`,
      date: newSale.date,
      description: `Venda para ${newSale.customerName || 'Cliente'}`.trim(),
      amount: newSale.total,
      type: 'income',
      category: 'Receita de Venda',
    };
    setTransactions((prev) => [newTransaction, ...prev]);

    setIsModalOpen(false);
  };

  const handleDeleteSale = (saleId: string) => {
    const saleToRemove = sales.find((sale) => sale.id === saleId);
    if (!saleToRemove) return;

    if (!confirm('Tem certeza que deseja excluir esta venda?')) {
      return;
    }

    setSales((prev) => prev.filter((sale) => sale.id !== saleId));

    setProducts((currentProducts) => {
      const updatedProducts = [...currentProducts];
      saleToRemove.items.forEach((item) => {
        const productIndex = updatedProducts.findIndex((product) => product.id === item.productId);
        if (productIndex !== -1) {
          updatedProducts[productIndex].stock += item.quantity;
        }
      });
      return updatedProducts;
    });

    setTransactions((prev) => prev.filter((transaction) => transaction.id !== `TRN-SALE-${saleId}`));
  };

  return (
    <>
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
        <div className="mb-6 flex items-center justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white transition hover:bg-emerald-700"
          >
            <PlusIcon className="mr-2 h-5 w-5" />
            Registrar Nova Venda
          </button>
        </div>

        <h3 className="mb-4 text-lg font-semibold text-gray-200">Historico de Vendas</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-700/50 text-sm uppercase tracking-wide text-gray-400">
                <th className="px-6 py-3 font-medium">Data</th>
                <th className="px-6 py-3 font-medium">Cliente</th>
                <th className="px-6 py-3 font-medium">Itens</th>
                <th className="px-6 py-3 font-medium text-right">Total</th>
                <th className="px-6 py-3 font-medium text-right">Acoes</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              {sales.length > 0 ? (
                sales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-700/60 transition hover:bg-gray-700/50">
                    <td className="px-6 py-4">{formatDate(sale.date)}</td>
                    <td className="px-6 py-4 font-medium">{sale.customerName || 'N/A'}</td>
                    <td className="px-6 py-4">{sale.items.reduce((acc, item) => acc + item.quantity, 0)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-emerald-400">
                      {formatCurrency(sale.total)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteSale(sale.id)}
                        className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800"
                        aria-label="Excluir venda"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-500">
                    <ShoppingCartIcon className="mx-auto h-16 w-16 text-gray-600" />
                    <h3 className="mt-2 text-lg font-medium">Nenhuma venda registrada</h3>
                    <p className="text-sm text-gray-400">Registre sua primeira venda para comecar.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <SaleFormModal
          products={products}
          settings={settings}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSale}
        />
      )}
    </>
  );
};

export default SalesPage;



