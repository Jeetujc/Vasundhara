export const STORAGE_ADAPTER = 'STORAGE_ADAPTER';

export interface StorageAdapter {
  save(buffer: Buffer, key: string, mimeType?: string): Promise<string>;
}
