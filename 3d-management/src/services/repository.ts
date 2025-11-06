// Base types for database operations
export interface QueryParams {
  table: string;
  where?: Record<string, unknown>;
  data?: Record<string, unknown>;
  select?: string[];
  limit?: number;
  offset?: number;
  orderBy?: { column: string; order: 'asc' | 'desc' };
}

export interface DbResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Base repository class with type-safe operations
export class Repository<T extends { id: string }> {
  constructor(private tableName: string) {}

  async findAll(options?: {
    limit?: number;
    offset?: number;
    orderBy?: { column: string; order: 'asc' | 'desc' };
  }): Promise<T[]> {
    const params: QueryParams = {
      table: this.tableName,
      ...options,
    };

    const result = await window.electronAPI.db.query(params);

    if (!result.success) {
      throw new Error(result.error || 'Query failed');
    }

    return result.data as T[];
  }

  async findById(id: string): Promise<T | null> {
    const params: QueryParams = {
      table: this.tableName,
      where: { id },
      limit: 1,
    };

    const result = await window.electronAPI.db.query(params);

    if (!result.success) {
      throw new Error(result.error || 'Query failed');
    }

    const data = result.data as T[];
    return data.length > 0 ? data[0] : null;
  }

  async findWhere(where: Record<string, unknown>): Promise<T[]> {
    const params: QueryParams = {
      table: this.tableName,
      where,
    };

    const result = await window.electronAPI.db.query(params);

    if (!result.success) {
      throw new Error(result.error || 'Query failed');
    }

    return result.data as T[];
  }

  async create(data: Omit<T, 'id'> & { id: string }): Promise<string> {
    const params: QueryParams = {
      table: this.tableName,
      data: data as Record<string, unknown>,
    };

    const result = await window.electronAPI.db.insert(params);

    if (!result.success) {
      throw new Error(result.error || 'Insert failed');
    }

    return (result.data as { id: number }).id.toString();
  }

  async update(id: string, data: Partial<Omit<T, 'id'>>): Promise<void> {
    const params: QueryParams = {
      table: this.tableName,
      where: { id },
      data: data as Record<string, unknown>,
    };

    const result = await window.electronAPI.db.update(params);

    if (!result.success) {
      throw new Error(result.error || 'Update failed');
    }
  }

  async delete(id: string): Promise<void> {
    const params: QueryParams = {
      table: this.tableName,
      where: { id },
    };

    const result = await window.electronAPI.db.delete(params);

    if (!result.success) {
      throw new Error(result.error || 'Delete failed');
    }
  }
}
