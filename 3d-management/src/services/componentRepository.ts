import { Repository } from './repository';
import { Component } from '../types';

export class ComponentRepository extends Repository<Component> {
  constructor() {
    super('components');
  }

  async findByCategory(category: string): Promise<Component[]> {
    return this.findWhere({ category });
  }

  async findLowStock(threshold: number = 10): Promise<Component[]> {
    const all = await this.findAll();
    return all.filter((c) => c.stock < threshold);
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    const component = await this.findById(id);
    if (!component) {
      throw new Error('Component not found');
    }

    const newStock = component.stock + quantity;
    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }

    await this.update(id, { stock: newStock });
  }
}

export const componentRepository = new ComponentRepository();
