import { contextBridge, ipcRenderer } from 'electron';

// Type definitions for the API
interface QueryParams {
  table: string;
  where?: Record<string, unknown>;
  data?: Record<string, unknown>;
  select?: string[];
  limit?: number;
  offset?: number;
  orderBy?: { column: string; order: 'asc' | 'desc' };
}

interface DbResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Expose protected methods that are safe to use in the renderer
contextBridge.exposeInMainWorld('electronAPI', {
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },

  // Database API
  db: {
    query: (params: QueryParams): Promise<DbResponse> => ipcRenderer.invoke('db:query', params),
    insert: (params: QueryParams): Promise<DbResponse> => ipcRenderer.invoke('db:insert', params),
    update: (params: QueryParams): Promise<DbResponse> => ipcRenderer.invoke('db:update', params),
    delete: (params: QueryParams): Promise<DbResponse> => ipcRenderer.invoke('db:delete', params),
    migrate: (): Promise<DbResponse> => ipcRenderer.invoke('db:migrate'),
  },
});

// Type declaration for TypeScript
declare global {
  interface Window {
    electronAPI: {
      versions: {
        node: string;
        chrome: string;
        electron: string;
      };
      db: {
        query: (params: QueryParams) => Promise<DbResponse>;
        insert: (params: QueryParams) => Promise<DbResponse>;
        update: (params: QueryParams) => Promise<DbResponse>;
        delete: (params: QueryParams) => Promise<DbResponse>;
        migrate: () => Promise<DbResponse>;
      };
    };
  }
}

