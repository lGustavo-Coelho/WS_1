import { Repository } from './repository';
import { Printer } from '../types';

export class PrinterRepository extends Repository<Printer> {
  constructor() {
    super('printers');
  }

  async findAvailable(): Promise<Printer[]> {
    return this.findWhere({ status: 'available' });
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.update(id, { status } as Partial<Omit<Printer, 'id'>>);
  }

  async addPrintHours(id: string, hours: number): Promise<void> {
    const printer = await this.findById(id);
    if (!printer) {
      throw new Error('Printer not found');
    }

    const newHours = printer.total_print_hours + hours;
    await this.update(id, { total_print_hours: newHours });
  }
}

export const printerRepository = new PrinterRepository();
