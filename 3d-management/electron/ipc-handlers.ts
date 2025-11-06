import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { getDatabase } from './database';

// Type definitions for validation
interface QueryParams {
  table: string;
  where?: Record<string, unknown>;
  data?: Record<string, unknown>;
  select?: string[];
  limit?: number;
  offset?: number;
  orderBy?: { column: string; order: 'asc' | 'desc' };
}

// Whitelist of allowed tables
const ALLOWED_TABLES = [
  'filaments',
  'components',
  'printers',
  'products',
  'print_jobs',
  'quotes',
  'sales',
  'transactions',
  'investments',
  'settings',
  'users',
];

function validateTable(table: string): void {
  if (!ALLOWED_TABLES.includes(table)) {
    throw new Error(`Invalid table: ${table}`);
  }
}

function validateParams(params: QueryParams): void {
  validateTable(params.table);

  if (params.limit && (params.limit < 1 || params.limit > 1000)) {
    throw new Error('Limit must be between 1 and 1000');
  }

  if (params.offset && params.offset < 0) {
    throw new Error('Offset must be non-negative');
  }
}

export function setupIpcHandlers(): void {
  // SELECT query
  ipcMain.handle('db:query', async (_event: IpcMainInvokeEvent, params: QueryParams) => {
    try {
      validateParams(params);
      const db = getDatabase();

      let query = db(params.table);

      if (params.select) {
        query = query.select(params.select);
      }

      if (params.where) {
        query = query.where(params.where);
      }

      if (params.orderBy) {
        query = query.orderBy(params.orderBy.column, params.orderBy.order);
      }

      if (params.limit) {
        query = query.limit(params.limit);
      }

      if (params.offset) {
        query = query.offset(params.offset);
      }

      const results = await query;
      return { success: true, data: results };
    } catch (error) {
      console.error('Database query error:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // INSERT query
  ipcMain.handle('db:insert', async (_event: IpcMainInvokeEvent, params: QueryParams) => {
    try {
      validateTable(params.table);
      if (!params.data) {
        throw new Error('No data provided for insert');
      }

      const db = getDatabase();
      const [id] = await db(params.table).insert(params.data);

      return { success: true, data: { id } };
    } catch (error) {
      console.error('Database insert error:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // UPDATE query
  ipcMain.handle('db:update', async (_event: IpcMainInvokeEvent, params: QueryParams) => {
    try {
      validateTable(params.table);
      if (!params.data) {
        throw new Error('No data provided for update');
      }
      if (!params.where) {
        throw new Error('No where clause provided for update');
      }

      const db = getDatabase();
      const count = await db(params.table).where(params.where).update(params.data);

      return { success: true, data: { count } };
    } catch (error) {
      console.error('Database update error:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // DELETE query
  ipcMain.handle('db:delete', async (_event: IpcMainInvokeEvent, params: QueryParams) => {
    try {
      validateTable(params.table);
      if (!params.where) {
        throw new Error('No where clause provided for delete');
      }

      const db = getDatabase();
      const count = await db(params.table).where(params.where).delete();

      return { success: true, data: { count } };
    } catch (error) {
      console.error('Database delete error:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // Run migrations
  ipcMain.handle('db:migrate', async () => {
    try {
      const db = getDatabase();
      await db.migrate.latest();
      return { success: true };
    } catch (error) {
      console.error('Migration error:', error);
      return { success: false, error: (error as Error).message };
    }
  });
}
