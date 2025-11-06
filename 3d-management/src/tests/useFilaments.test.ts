import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFilaments } from '../hooks/useFilaments';

// Mock the repository
vi.mock('../services/filamentRepository', () => ({
  filamentRepository: {
    findAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    updateStock: vi.fn(),
  },
}));

// Mock the logger
vi.mock('../utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

import { filamentRepository } from '../services/filamentRepository';

describe('useFilaments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load filaments on mount', async () => {
    const mockFilaments = [
      {
        id: 'FIL-1',
        name: 'PLA Black',
        type: 'PLA',
        color: 'Black',
        brand: 'Sunlu',
        cost_per_kg: 85,
        stock_kg: 3,
        density: 1.24,
      },
    ];

    vi.mocked(filamentRepository.findAll).mockResolvedValue(mockFilaments);

    const { result } = renderHook(() => useFilaments());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.filaments).toEqual(mockFilaments);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors when loading filaments', async () => {
    const errorMessage = 'Failed to load';
    vi.mocked(filamentRepository.findAll).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFilaments());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.filaments).toEqual([]);
  });

  it('should create a new filament', async () => {
    vi.mocked(filamentRepository.findAll).mockResolvedValue([]);
    vi.mocked(filamentRepository.create).mockResolvedValue('FIL-123');

    const { result } = renderHook(() => useFilaments());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newFilament = {
      name: 'PLA White',
      type: 'PLA',
      color: 'White',
      brand: 'Sunlu',
      cost_per_kg: 85,
      stock_kg: 1,
      density: 1.24,
    };

    await result.current.create(newFilament);

    expect(filamentRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ...newFilament,
        id: expect.stringContaining('FIL-'),
      })
    );
  });
});
