import { logger } from '../utils/logger';
import { filamentRepository } from './filamentRepository';
import { componentRepository } from './componentRepository';
import { printerRepository } from './printerRepository';
import { Filament, Component, Printer } from '../types';

export class DataService {
  async initializeData() {
    try {
      logger.info('Initializing data from database');
      const filaments = await filamentRepository.findAll();
      const components = await componentRepository.findAll();
      const printers = await printerRepository.findAll();
      
      logger.info('Data loaded', { 
        filaments: filaments.length, 
        components: components.length, 
        printers: printers.length 
      });
      
      return { filaments, components, printers };
    } catch (error) {
      logger.error('Failed to initialize data', { error });
      throw error;
    }
  }

  async createFilament(filament: Filament) {
    try {
      await filamentRepository.create(filament as any);
      const created = await filamentRepository.findById(filament.id);

      if (!created) {
        throw new Error('Created filament not found');
      }

      logger.info('Filament created', { id: created.id, name: created.name });
      return created;
    } catch (error) {
      logger.error('Failed to create filament', { error, filament });
      throw error;
    }
  }

  async updateFilament(id: string, data: Partial<Filament>) {
    try {
      await filamentRepository.update(id, data as any);
      logger.info('Filament updated', { id });
      const updated = await filamentRepository.findById(id);

      if (!updated) {
        throw new Error('Updated filament not found');
      }

      return updated;
    } catch (error) {
      logger.error('Failed to update filament', { error, id });
      throw error;
    }
  }

  async deleteFilament(id: string) {
    try {
      await filamentRepository.delete(id);
      logger.info('Filament deleted', { id });
    } catch (error) {
      logger.error('Failed to delete filament', { error, id });
      throw error;
    }
  }

  async getFilaments() {
    try {
      return await filamentRepository.findAll();
    } catch (error) {
      logger.error('Failed to get filaments', { error });
      throw error;
    }
  }

  async createComponent(component: Component) {
    try {
      await componentRepository.create(component as any);
      const created = await componentRepository.findById(component.id);

      if (!created) {
        throw new Error('Created component not found');
      }

      logger.info('Component created', { id: created.id, name: created.name });
      return created;
    } catch (error) {
      logger.error('Failed to create component', { error, component });
      throw error;
    }
  }

  async updateComponent(id: string, data: Partial<Component>) {
    try {
      await componentRepository.update(id, data as any);
      logger.info('Component updated', { id });
      const updated = await componentRepository.findById(id);

      if (!updated) {
        throw new Error('Updated component not found');
      }

      return updated;
    } catch (error) {
      logger.error('Failed to update component', { error, id });
      throw error;
    }
  }

  async deleteComponent(id: string) {
    try {
      await componentRepository.delete(id);
      logger.info('Component deleted', { id });
    } catch (error) {
      logger.error('Failed to delete component', { error, id });
      throw error;
    }
  }

  async getComponents() {
    try {
      return await componentRepository.findAll();
    } catch (error) {
      logger.error('Failed to get components', { error });
      throw error;
    }
  }

  async createPrinter(printer: Printer) {
    try {
      await printerRepository.create(printer as any);
      const created = await printerRepository.findById(printer.id);

      if (!created) {
        throw new Error('Created printer not found');
      }

      logger.info('Printer created', { id: created.id, name: created.name });
      return created;
    } catch (error) {
      logger.error('Failed to create printer', { error, printer });
      throw error;
    }
  }

  async updatePrinter(id: string, data: Partial<Printer>) {
    try {
      await printerRepository.update(id, data as any);
      logger.info('Printer updated', { id });
      const updated = await printerRepository.findById(id);

      if (!updated) {
        throw new Error('Updated printer not found');
      }

      return updated;
    } catch (error) {
      logger.error('Failed to update printer', { error, id });
      throw error;
    }
  }

  async deletePrinter(id: string) {
    try {
      await printerRepository.delete(id);
      logger.info('Printer deleted', { id });
    } catch (error) {
      logger.error('Failed to delete printer', { error, id });
      throw error;
    }
  }

  async getPrinters() {
    try {
      return await printerRepository.findAll();
    } catch (error) {
      logger.error('Failed to get printers', { error });
      throw error;
    }
  }

  async getComponentLowStock(threshold: number = 10) {
    try {
      return await componentRepository.findLowStock(threshold);
    } catch (error) {
      logger.error('Failed to get low stock components', { error });
      throw error;
    }
  }

  async updateComponentStock(id: string, amount: number) {
    try {
      await componentRepository.updateStock(id, amount);
      logger.info('Component stock updated', { id, amount });
      const updated = await componentRepository.findById(id);

      if (!updated) {
        throw new Error('Updated component not found after stock change');
      }

      return updated;
    } catch (error) {
      logger.error('Failed to update component stock', { error, id, amount });
      throw error;
    }
  }

  async getFilamentLowStock(threshold: number = 1) {
    try {
      return await filamentRepository.findLowStock(threshold);
    } catch (error) {
      logger.error('Failed to get low stock filaments', { error });
      throw error;
    }
  }

  async updateFilamentStock(id: string, amount: number) {
    try {
      await filamentRepository.updateStock(id, amount);
      logger.info('Filament stock updated', { id, amount });
      return await filamentRepository.findById(id);
    } catch (error) {
      logger.error('Failed to update filament stock', { error, id, amount });
      throw error;
    }
  }
}

export const dataService = new DataService();
