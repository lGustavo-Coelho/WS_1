import { Repository } from './repository';
import { Filament } from '../types';

export class FilamentRepository extends Repository<Filament> {
  constructor() {
    super('filaments');
  }

  async findByType(type: string): Promise<Filament[]> {
    return this.findWhere({ type });
  }

  async findLowStock(threshold: number = 1): Promise<Filament[]> {
    const all = await this.findAll();
    return all.filter((f) => f.stock_kg < threshold);
  }

  async updateStock(id: string, amount: number): Promise<void> {
    const filament = await this.findById(id);
    if (!filament) {
      throw new Error('Filament not found');
    }

    const newStock = filament.stock_kg + amount;
    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }

    await this.update(id, { stock_kg: newStock });
  }
}

export const filamentRepository = new FilamentRepository();
