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

  async createFilament(data: Omit<Filament, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const filament = await filamentRepository.create(data as any);
      logger.info('Filament created', { id: (filament as any).id, name: data.name });
      return filament;
    } catch (error) {
      logger.error('Failed to create filament', { error, data });
      throw error;
    }
  }

  async updateFilament(id: string, data: Partial<Filament>) {
    try {
      await filamentRepository.update(id, data as any);
      logger.info('Filament updated', { id });
      return await filamentRepository.findById(id);
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

  async createComponent(data: Omit<Component, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const component = await componentRepository.create(data as any);
      logger.info('Component created', { id: (component as any).id, name: data.name });
      return component;
    } catch (error) {
      logger.error('Failed to create component', { error, data });
      throw error;
    }
  }

  async updateComponent(id: string, data: Partial<Component>) {
    try {
      await componentRepository.update(id, data as any);
      logger.info('Component updated', { id });
      return await componentRepository.findById(id);
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

  async createPrinter(data: Omit<Printer, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const printer = await printerRepository.create(data as any);
      logger.info('Printer created', { id: (printer as any).id, name: data.name });
      return printer;
    } catch (error) {
      logger.error('Failed to create printer', { error, data });
      throw error;
    }
  }

  async updatePrinter(id: string, data: Partial<Printer>) {
    try {
      await printerRepository.update(id, data as any);
      logger.info('Printer updated', { id });
      return await printerRepository.findById(id);
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
