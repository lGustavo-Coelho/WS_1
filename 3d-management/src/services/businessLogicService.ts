export interface CostCalculation {
  filamentCost: number;
  energyCost: number;
  laborCost: number;
  totalCost: number;
  margin: number;
  finalPrice: number;
}

export interface StockValidation {
  isValid: boolean;
  message?: string;
  missingItems?: Array<{ item: string; required: number; available: number }>;
}

export class BusinessLogicService {
  constructor(
    private kwhCost: number = 0.5,
    private profitMargin: number = 30,
    private laborHourlyRate: number = 50
  ) {}

  calculateFilamentCost(weightGrams: number, costPerKg: number): number {
    return (weightGrams / 1000) * costPerKg;
  }

  calculateEnergyCost(durationHours: number, printerPowerW: number): number {
    const kwhUsed = (printerPowerW / 1000) * durationHours;
    return kwhUsed * this.kwhCost;
  }

  calculateLaborCost(
    printHours: number,
    postProcessingHours: number,
    designHours: number = 0,
    hourlyRate: number = this.laborHourlyRate
  ): number {
    const totalHours = printHours + postProcessingHours + designHours;
    return totalHours * hourlyRate;
  }

  calculatePrintCost(params: {
    filamentWeightGrams: number;
    filamentCostPerKg: number;
    durationHours: number;
    printerPowerW: number;
    postProcessingHours?: number;
    designHours?: number;
  }): CostCalculation {
    const filamentCost = this.calculateFilamentCost(
      params.filamentWeightGrams,
      params.filamentCostPerKg
    );

    const energyCost = this.calculateEnergyCost(params.durationHours, params.printerPowerW);

    const laborCost = this.calculateLaborCost(
      params.durationHours,
      params.postProcessingHours || 0,
      params.designHours || 0
    );

    const totalCost = filamentCost + energyCost + laborCost;
    const margin = (totalCost * this.profitMargin) / 100;
    const finalPrice = totalCost + margin;

    return {
      filamentCost,
      energyCost,
      laborCost,
      totalCost,
      margin,
      finalPrice,
    };
  }

  validateStockForPrintJob(params: {
    filamentWeightGrams: number;
    filamentAvailableKg: number;
    componentsNeeded?: Array<{ componentId: string; quantity: number; available: number }>;
  }): StockValidation {
    const filamentNeededKg = params.filamentWeightGrams / 1000;

    if (filamentNeededKg > params.filamentAvailableKg) {
      return {
        isValid: false,
        message: 'Insufficient filament stock',
        missingItems: [
          {
            item: 'Filament',
            required: params.filamentWeightGrams,
            available: Math.round(params.filamentAvailableKg * 1000),
          },
        ],
      };
    }

    const missingComponents = params.componentsNeeded?.filter(
      (c) => c.quantity > c.available
    ) || [];

    if (missingComponents.length > 0) {
      return {
        isValid: false,
        message: 'Insufficient component stock',
        missingItems: missingComponents.map((c) => ({
          item: `Component ${c.componentId}`,
          required: c.quantity,
          available: c.available,
        })),
      };
    }

    return { isValid: true };
  }

  updateStockAfterPrintJob(params: {
    filamentUsedGrams: number;
    filamentCurrentKg: number;
  }): number {
    const filamentUsedKg = params.filamentUsedGrams / 1000;
    return params.filamentCurrentKg - filamentUsedKg;
  }
}

export const businessLogicService = new BusinessLogicService();
