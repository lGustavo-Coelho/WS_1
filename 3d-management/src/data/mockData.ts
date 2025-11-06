
import { Filament, Component, Printer, Transaction, Investment, Product, Sale, Quote, PrintJob, Settings, User } from '../types';

export const mockFilaments: Filament[] = [
  { id: 'FIL-1', name: 'PLA Premium', type: 'PLA', color: 'Preto', stock: 850, costPerKg: 120, purchaseDate: '2023-10-01T10:00:00Z' },
  { id: 'FIL-2', name: 'ABS Forte', type: 'ABS', color: 'Branco', stock: 500, costPerKg: 110, purchaseDate: '2023-09-15T10:00:00Z' },
  { id: 'FIL-3', name: 'PETG Cristal', type: 'PETG', color: 'Transparente', stock: 1000, costPerKg: 135, purchaseDate: '2023-10-05T10:00:00Z' },
];

export const mockComponents: Component[] = [
  { id: 'COMP-1', name: 'Parafuso M3x8', unit: 'unidade', stock: 200, costPerUnit: 0.15, supplier: 'Parafusos & Cia', purchaseDate: '2023-08-20T10:00:00Z' },
  { id: 'COMP-2', name: 'Rolamento 608zz', unit: 'unidade', stock: 50, costPerUnit: 2.50, supplier: 'Casa do Rolamento', purchaseDate: '2023-09-01T10:00:00Z' },
];

export const mockPrinters: Printer[] = [
  { id: 'PRN-1', name: 'Ender 3 V2', model: 'Creality', status: 'Ociosa', nozzleSize: 0.4, purchaseValue: 1800, lifespanHours: 4000, powerConsumptionWatts: 350, purchaseDate: '2023-01-10T10:00:00Z', printedHours: 520, powerConsumptionKW: 0.35, hourlyDepreciation: 0.45 },
  { id: 'PRN-2', name: 'Saturn 2', model: 'Elegoo', status: 'Imprimindo', nozzleSize: 0, purchaseValue: 3500, lifespanHours: 2000, powerConsumptionWatts: 90, purchaseDate: '2023-05-22T10:00:00Z', printedHours: 210, powerConsumptionKW: 0.09, hourlyDepreciation: 1.75 },
];

export const mockTransactions: Transaction[] = [
  { id: 'TRN-1', date: '2023-10-25T10:00:00Z', description: 'Venda de Suporte de Celular', amount: 45.00, type: 'income', category: 'Receita de Venda' },
  { id: 'TRN-2', date: '2023-10-24T10:00:00Z', description: 'Compra de Filamento PLA', amount: 120.00, type: 'expense', category: 'Compra de Suprimento' },
  { id: 'TRN-3', date: '2023-10-22T10:00:00Z', description: 'Conta de Energia', amount: 150.00, type: 'expense', category: 'Despesa Operacional' },
];

export const mockInvestments: Investment[] = [
  { id: 'INV-1', name: 'Impressora 3D Ender 3 V2', purchaseDate: '2023-01-10T10:00:00Z', initialCost: 1800, currentValue: 1650, type: 'equipment' },
  { id: 'INV-2', name: 'Licença PrusaSlicer Pro', purchaseDate: '2023-03-15T10:00:00Z', initialCost: 250, currentValue: 250, type: 'software' },
];

export const mockProducts: Product[] = [
  { id: 'PROD-1', name: 'Suporte de Celular Articulado', description: 'Suporte para celular com design moderno.', price: 25.00, stock: 10, filamentUsedGrams: 50, printingTimeHours: 2.5, filamentId: 'FIL-1', printerId: 'PRN-1' },
  { id: 'PROD-2', name: 'Vaso Geométrico', description: 'Vaso decorativo para plantas pequenas.', price: 45.00, stock: 5, filamentUsedGrams: 120, printingTimeHours: 6, filamentId: 'FIL-3', printerId: 'PRN-1' },
];

export const mockSales: Sale[] = [
  { id: 'SALE-1', date: '2023-10-25T10:00:00Z', items: [{ productId: 'PROD-1', quantity: 2, unitPrice: 22.50 }], total: 45.00, customerName: 'João Silva' }
];

export const mockQuotes: Quote[] = [
  { 
    id: 'QTE-1', 
    customerName: 'Empresa XYZ', 
    date: '2023-10-20T10:00:00Z', 
    status: 'pending', 
    items: [{
      id: 'item-1',
      description: 'Protótipo de peça',
      filamentGrams: 200,
      printHours: 8,
      postProcessingHours: 1,
      filamentId: 'FIL-1',
      printerId: 'PRN-1',
      price: 150.00
    }], 
    totalPrice: 150.00,
    designHours: 2,
    preparationHours: 0.5,
  }
];

export const mockPrintJobs: PrintJob[] = [
  { id: 'JOB-1', name: 'Vaso Geométrico #5', printerId: 'PRN-1', filamentId: 'FIL-3', filamentUsedGrams: 120, durationHours: 6, status: 'completed', startDate: '2023-10-26T10:00:00Z', endDate: '2023-10-26T16:00:00Z' },
  { id: 'JOB-2', name: 'Protótipo Cliente A', printerId: 'PRN-2', filamentId: 'FIL-2', filamentUsedGrams: 80, durationHours: 4, status: 'printing', startDate: '2023-10-27T09:00:00Z' },
];

export const mockSettings: Settings = {
    currency: 'BRL',
    kwhCost: 0.75,
    profitMargin: 30,
    designHourlyRate: 50,
    preparationHourlyRate: 25,
    postProcessingHourlyRate: 30,
};

export const mockUsers: User[] = [
  {
    id: 'USER-1',
    name: 'Gustavo Coelho',
    email: 'gucoelho1@gmail.com',
    password: '147852369',
  },
];
