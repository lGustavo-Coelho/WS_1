// Global type declarations for Electron API
export {};

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
