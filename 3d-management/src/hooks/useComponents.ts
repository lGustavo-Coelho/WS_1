import { useState, useEffect, useCallback } from 'react';
import { Component } from '../types';
import { componentRepository } from '../services/componentRepository';
import { logger } from '../utils/logger';

interface UseComponentsResult {
  components: Component[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (component: Omit<Component, 'id'>) => Promise<void>;
  update: (id: string, data: Partial<Omit<Component, 'id'>>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  updateStock: (id: string, quantity: number) => Promise<void>;
}

export function useComponents(): UseComponentsResult {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await componentRepository.findAll({ 
        orderBy: { column: 'name', order: 'asc' } 
      });
      setComponents(data);
      logger.info('Components loaded', { count: data.length });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load components';
      setError(message);
      logger.error('Failed to load components', { error: err });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (componentData: Omit<Component, 'id'>) => {
    try {
      setError(null);
      const id = `CMP-${Date.now()}`;
      await componentRepository.create({ id, ...componentData });
      logger.info('Component created', { id });
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create component';
      setError(message);
      logger.error('Failed to create component', { error: err });
      throw err;
    }
  }, [refresh]);

  const update = useCallback(async (id: string, data: Partial<Omit<Component, 'id'>>) => {
    try {
      setError(null);
      await componentRepository.update(id, data);
      logger.info('Component updated', { id });
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update component';
      setError(message);
      logger.error('Failed to update component', { error: err });
      throw err;
    }
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    try {
      setError(null);
      await componentRepository.delete(id);
      logger.info('Component deleted', { id });
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete component';
      setError(message);
      logger.error('Failed to delete component', { error: err });
      throw err;
    }
  }, [refresh]);

  const updateStock = useCallback(async (id: string, quantity: number) => {
    try {
      setError(null);
      await componentRepository.updateStock(id, quantity);
      logger.info('Component stock updated', { id, quantity });
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update stock';
      setError(message);
      logger.error('Failed to update stock', { error: err });
      throw err;
    }
  }, [refresh]);

  return {
    components,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
    updateStock,
  };
}
