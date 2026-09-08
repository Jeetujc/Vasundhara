import { Injectable } from '@nestjs/common';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { StorageAdapter } from './storage-adapter.interface.js';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

// Dev-only stand-in for S3-compatible storage (per the architecture doc's
// "Documents: S3-compatible storage" row). Once real AWS/S3 credentials
// exist, write an S3StorageAdapter implementing the same StorageAdapter
// interface and swap it in documents.module.ts -- DocumentsService itself
// needs no changes.
@Injectable()
export class LocalDiskStorageAdapter implements StorageAdapter {
  async save(buffer: Buffer, key: string): Promise<string> {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(join(UPLOAD_DIR, key), buffer);
    return key;
  }
}
