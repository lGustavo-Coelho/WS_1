import { useState, useEffect, useCallback } from 'react';
import { Printer } from '../types';
import { printerRepository } from '../services/printerRepository';
import { logger } from '../utils/logger';

interface UsePrintersResult {
  printers: Printer[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (printer: Omit<Printer, 'id'>) => Promise<void>;
  update: (id: string, data: Partial<Omit<Printer, 'id'>>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
  addPrintHours: (id: string, hours: number) => Promise<void>;
}

export function usePrinters(): UsePrintersResult {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await printerRepository.findAll({ 
        orderBy: { column: 'name', order: 'asc' } 
      });
      setPrinters(data);
      logger.info('Printers loaded', { count: data.length });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load printers';
      setError(message);
      logger.error('Failed to load printers', { error: err });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (printerData: Omit<Printer, 'id'>) => {
    try {
      setError(null);
      const id = `PRT-${Date.now()}`;
      await printerRepository.create({ id, ...printerData });
      logger.info('Printer created', { id });
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create printer';
      setError(message);
      logger.error('Failed to create printer', { error: err });
      throw err;
    }
  }, [refresh]);

  const update = useCallback(async (id: string, data: Partial<Omit<Printer, 'id'>>) => {
    try {
      setError(null);
      await printerRepository.update(id, data);
      logger.info('Printer updated', { id });
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update printer';
      setError(message);
      logger.error('Failed to update printer', { error: err });
      throw err;
    }
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    try {
      setError(null);
      await printerRepository.delete(id);
      logger.info('Printer deleted', { id });
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete printer';
      setError(message);
      logger.error('Failed to delete printer', { error: err });
      throw err;
    }
  }, [refresh]);

  const updateStatus = useCallback(async (id: string, status: string) => {
    try {
      setError(null);
      await printerRepository.updateStatus(id, status);
      logger.info('Printer status updated', { id, status });
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      setError(message);
      logger.error('Failed to update status', { error: err });
      throw err;
    }
  }, [refresh]);

  const addPrintHours = useCallback(async (id: string, hours: number) => {
    try {
      setError(null);
      await printerRepository.addPrintHours(id, hours);
      logger.info('Print hours added', { id, hours });
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add print hours';
      setError(message);
      logger.error('Failed to add print hours', { error: err });
      throw err;
    }
  }, [refresh]);

  return {
    printers,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
    updateStatus,
    addPrintHours,
  };
}
