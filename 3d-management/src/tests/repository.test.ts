import { describe, it, expect } from 'vitest';
import { Repository } from '../services/repository';

// Mock window.electronAPI for tests
global.window = {
  electronAPI: {
    db: {
      query: async () => ({ success: true, data: [] }),
      insert: async () => ({ success: true, data: { id: 1 } }),
      update: async () => ({ success: true, data: { count: 1 } }),
      delete: async () => ({ success: true, data: { count: 1 } }),
      migrate: async () => ({ success: true }),
    },
  },
} as unknown as Window & typeof globalThis;

interface TestEntity {
  id: string;
  name: string;
}

describe('Repository', () => {
  it('should create a repository instance', () => {
    const repo = new Repository<TestEntity>('test_table');
    expect(repo).toBeDefined();
  });

  it('should call findAll successfully', async () => {
    const repo = new Repository<TestEntity>('test_table');
    const result = await repo.findAll();
    expect(Array.isArray(result)).toBe(true);
  });
});
