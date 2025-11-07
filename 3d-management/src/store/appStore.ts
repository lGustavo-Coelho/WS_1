import { create } from 'zustand';
import { Filament, Component, Printer, Product, PrintJob, Quote, Sale, Transaction, Investment } from '../types';

interface AppState {
  filaments: Filament[];
  components: Component[];
  printers: Printer[];
  products: Product[];
  printJobs: PrintJob[];
  quotes: Quote[];
  sales: Sale[];
  transactions: Transaction[];
  investments: Investment[];
  loading: boolean;
  error: string | null;

  setFilaments: (filaments: Filament[]) => void;
  setComponents: (components: Component[]) => void;
  setPrinters: (printers: Printer[]) => void;
  setProducts: (products: Product[]) => void;
  setPrintJobs: (printJobs: PrintJob[]) => void;
  setQuotes: (quotes: Quote[]) => void;
  setSales: (sales: Sale[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setInvestments: (investments: Investment[]) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  addFilament: (filament: Filament) => void;
  updateFilament: (id: string, filament: Partial<Filament>) => void;
  deleteFilament: (id: string) => void;

  addComponent: (component: Component) => void;
  updateComponent: (id: string, component: Partial<Component>) => void;
  deleteComponent: (id: string) => void;

  addPrinter: (printer: Printer) => void;
  updatePrinter: (id: string, printer: Partial<Printer>) => void;
  deletePrinter: (id: string) => void;

  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addPrintJob: (job: PrintJob) => void;
  updatePrintJob: (id: string, job: Partial<PrintJob>) => void;
  deletePrintJob: (id: string) => void;

  addQuote: (quote: Quote) => void;
  updateQuote: (id: string, quote: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;

  addSale: (sale: Sale) => void;
  deleteSale: (id: string) => void;

  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;

  addInvestment: (investment: Investment) => void;
  updateInvestment: (id: string, investment: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  filaments: [],
  components: [],
  printers: [],
  products: [],
  printJobs: [],
  quotes: [],
  sales: [],
  transactions: [],
  investments: [],
  loading: false,
  error: null,

  setFilaments: (filaments) => set({ filaments }),
  setComponents: (components) => set({ components }),
  setPrinters: (printers) => set({ printers }),
  setProducts: (products) => set({ products }),
  setPrintJobs: (printJobs) => set({ printJobs }),
  setQuotes: (quotes) => set({ quotes }),
  setSales: (sales) => set({ sales }),
  setTransactions: (transactions) => set({ transactions }),
  setInvestments: (investments) => set({ investments }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addFilament: (filament) =>
    set((state) => ({ filaments: [...state.filaments, filament] })),
  updateFilament: (id, filament) =>
    set((state) => ({
      filaments: state.filaments.map((f) => (f.id === id ? { ...f, ...filament } : f)),
    })),
  deleteFilament: (id) =>
    set((state) => ({ filaments: state.filaments.filter((f) => f.id !== id) })),

  addComponent: (component) =>
    set((state) => ({ components: [...state.components, component] })),
  updateComponent: (id, component) =>
    set((state) => ({
      components: state.components.map((c) => (c.id === id ? { ...c, ...component } : c)),
    })),
  deleteComponent: (id) =>
    set((state) => ({ components: state.components.filter((c) => c.id !== id) })),

  addPrinter: (printer) =>
    set((state) => ({ printers: [...state.printers, printer] })),
  updatePrinter: (id, printer) =>
    set((state) => ({
      printers: state.printers.map((p) => (p.id === id ? { ...p, ...printer } : p)),
    })),
  deletePrinter: (id) =>
    set((state) => ({ printers: state.printers.filter((p) => p.id !== id) })),

  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...product } : p)),
    })),
  deleteProduct: (id) =>
    set((state) => ({ products: state.products.filter((p) => p.id !== id) })),

  addPrintJob: (job) =>
    set((state) => ({ printJobs: [...state.printJobs, job] })),
  updatePrintJob: (id, job) =>
    set((state) => ({
      printJobs: state.printJobs.map((j) => (j.id === id ? { ...j, ...job } : j)),
    })),
  deletePrintJob: (id) =>
    set((state) => ({ printJobs: state.printJobs.filter((j) => j.id !== id) })),

  addQuote: (quote) =>
    set((state) => ({ quotes: [...state.quotes, quote] })),
  updateQuote: (id, quote) =>
    set((state) => ({
      quotes: state.quotes.map((q) => (q.id === id ? { ...q, ...quote } : q)),
    })),
  deleteQuote: (id) =>
    set((state) => ({ quotes: state.quotes.filter((q) => q.id !== id) })),

  addSale: (sale) =>
    set((state) => ({ sales: [...state.sales, sale] })),
  deleteSale: (id) =>
    set((state) => ({ sales: state.sales.filter((s) => s.id !== id) })),

  addTransaction: (transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),
  deleteTransaction: (id) =>
    set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) })),

  addInvestment: (investment) =>
    set((state) => ({ investments: [...state.investments, investment] })),
  updateInvestment: (id, investment) =>
    set((state) => ({
      investments: state.investments.map((i) => (i.id === id ? { ...i, ...investment } : i)),
    })),
  deleteInvestment: (id) =>
    set((state) => ({ investments: state.investments.filter((i) => i.id !== id) })),
}));
