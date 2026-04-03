import type { MediaRecord } from './types';

const DB_NAME = 'KeepCoreDB';
const STORE_NAME = 'media';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    if (typeof window === 'undefined' || !window.indexedDB) {
        return reject('IndexedDB is not supported in this browser.');
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject('IndexedDB error: ' + (event.target as any).errorCode);
    };

    request.onsuccess = (event) => {
      db = (event.target as any).result;
      resolve(db as IDBDatabase);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as any).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export function addMedia(media: Omit<MediaRecord, 'id' | 'createdAt'>): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const newRecord: MediaRecord = {
        ...media,
        id: crypto.randomUUID(),
        createdAt: new Date(),
    };

    const request = store.add(newRecord);

    request.onsuccess = () => {
      resolve(newRecord.id);
    };

    request.onerror = (event) => {
      reject('Error adding media: ' + (event.target as any).error);
    };
  });
}

export function getAllMedia(): Promise<MediaRecord[]> {
  return new Promise(async (resolve, reject) => {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      // Sort by newest first
      const sorted = request.result.sort((a: MediaRecord, b: MediaRecord) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      resolve(sorted);
    };

    request.onerror = (event) => {
      reject('Error fetching media: ' + (event.target as any).error);
    };
  });
}

export function deleteMedia(id: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject('Error deleting media: ' + (event.target as any).error);
    };
  });
}
