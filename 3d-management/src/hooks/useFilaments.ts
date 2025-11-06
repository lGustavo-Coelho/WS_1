import { useState, useEffect, useCallback } from 'react';
import { Filament } from '../types';
import { filamentRepository } from '../services/filamentRepository';
import { logger } from '../utils/logger';

interface UseFilamentsResult {
  filaments: Filament[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (filament: Omit<Filament, 'id'>) => Promise<void>;
  update: (id: string, data: Partial<Omit<Filament, 'id'>>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  updateStock: (id: string, amount: number) => Promise<void>;
}

export function useFilaments(): UseFilamentsResult {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await filamentRepository.findAll({ 
        orderBy: { column: 'name', order: 'asc' } 
      });
      setFilaments(data);
      logger.info('Filaments loaded', { count: data.length });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load filaments';
      setError(message);
      logger.error('Failed to load filaments', { error: err });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (filamentData: Omit<Filament, 'id'>) => {
    try {
      setError(null);
      const id = `FIL-${Date.now()}`;
      await filamentRepository.create({ id, ...filamentData });
      logger.info('Filament created', { id });
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create filament';
      setError(message);
      logger.error('Failed to create filament', { error: err });
      throw err;
    }
  }, [refresh]);

  const update = useCallback(async (id: string, data: Partial<Omit<Filament, 'id'>>) => {
    try {
      setError(null);
      await filamentRepository.update(id, data);
      logger.info('Filament updated', { id });
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update filament';
      setError(message);
      logger.error('Failed to update filament', { error: err });
      throw err;
    }
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    try {
      setError(null);
      await filamentRepository.delete(id);
      logger.info('Filament deleted', { id });
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete filament';
      setError(message);
      logger.error('Failed to delete filament', { error: err });
      throw err;
    }
  }, [refresh]);

  const updateStock = useCallback(async (id: string, amount: number) => {
    try {
      setError(null);
      await filamentRepository.updateStock(id, amount);
      logger.info('Filament stock updated', { id, amount });
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update stock';
      setError(message);
      logger.error('Failed to update stock', { error: err });
      throw err;
    }
  }, [refresh]);

  return {
    filaments,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
    updateStock,
  };
}
