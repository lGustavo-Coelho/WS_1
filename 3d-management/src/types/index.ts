
export type PrinterStatus = 'Ociosa' | 'Imprimindo' | 'Em Manutenção' | 'Offline';
export type TransactionType = 'income' | 'expense';
export type InvestmentType = 'equipment' | 'software' | 'other';
export type FilamentType = 'PLA' | 'ABS' | 'PETG' | 'TPU';
export type PrintJobStatus = 'queued' | 'printing' | 'completed' | 'failed' | 'cancelled';
export type QuoteStatus = 'pending' | 'accepted' | 'rejected';

export type TransactionCategory =
  | 'Compra de Suprimento'
  | 'Despesa Operacional'
  | 'Compra de Equipamento'
  | 'Receita de Venda'
  | 'Investimento'
  | 'Outro';

export interface Filament {
  id: string;
  name: string;
  type: FilamentType;
  color: string;
  stock: number; // grams
  costPerKg: number;
  purchaseDate: string; // ISO string
}

export interface Component {
  id: string;
  name: string;
  unit: string; // e.g., 'piece', 'meter'
  stock: number;
  costPerUnit: number;
  supplier: string;
  purchaseDate?: string; // ISO string
}

export interface Printer {
  id: string;
  name: string;
  model: string;
  status: PrinterStatus;
  nozzleSize: number;
  purchaseValue?: number;
  lifespanHours?: number;
  powerConsumptionWatts?: number;
  purchaseDate?: string;
  printedHours: number;
  powerConsumptionKW: number;
  hourlyDepreciation: number;
}

export interface Transaction {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  notes?: string;
}

export interface Investment {
  id: string;
  name: string;
  purchaseDate: string; // ISO string
  initialCost: number;
  currentValue: number;
  type: InvestmentType;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  filamentUsedGrams: number;
  printingTimeHours: number;
  imageUrl?: string;
  filamentId: string;
  printerId: string;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: string;
  date: string; // ISO string
  items: SaleItem[];
  total: number;
  customerName?: string;
}

export interface QuoteItem {
  id: string; // Temporary ID for list management
  description: string;
  filamentGrams: number;
  printHours: number;
  postProcessingHours: number;
  filamentId: string;
  printerId: string;
  price: number; // The calculated final price for this item
}

export interface Quote {
  id:string;
  customerName: string;
  date: string; // ISO string
  status: QuoteStatus;
  items: QuoteItem[];
  totalPrice: number;
  designHours?: number;
  preparationHours?: number;
}


export interface PrintJob {
  id: string;
  name: string;
  printerId: string;
  filamentId: string;
  filamentUsedGrams: number;
  durationHours: number;
  status: PrintJobStatus;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface Settings {
    currency: 'BRL' | 'USD';
    kwhCost: number; // Cost per kilowatt-hour
    profitMargin: number; // as a percentage, e.g., 30 for 30%
    designHourlyRate: number; // Cost per hour for design work
    preparationHourlyRate: number; // Cost per hour for printer setup/slicing
    postProcessingHourlyRate: number; // Cost per hour for finishing work
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}
