// IndexedDB Helper for storing Quran text locally
const DB_NAME = 'QuranRecitationDB';
const DB_VERSION = 1;
const STORE_NAME = 'quran_text';

interface QuranAyah {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  arabicText: string;
  simpleText: string;
  transliteration?: string;
  surahNameArabic: string;
  surahNameEnglish: string;
  juzNumber?: number;
  words?: string[];
}

class QuranIndexedDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('[IndexedDB] Failed to open database');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('[IndexedDB] Database opened successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          
          // Create indexes for efficient querying
          objectStore.createIndex('surah_ayah', ['surahNumber', 'ayahNumber'], { unique: true });
          objectStore.createIndex('surah', 'surahNumber', { unique: false });
          objectStore.createIndex('juz', 'juzNumber', { unique: false });
          
          console.log('[IndexedDB] Object store created');
        }
      };
    });
  }

  async storeAyahs(ayahs: QuranAyah[]): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      let completed = 0;
      const total = ayahs.length;

      ayahs.forEach((ayah) => {
        const request = store.put(ayah);
        
        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            console.log(`[IndexedDB] Stored ${total} ayahs`);
            resolve();
          }
        };

        request.onerror = () => {
          console.error('[IndexedDB] Failed to store ayah:', ayah);
          reject(request.error);
        };
      });

      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }

  async getAyahsByRange(surahNumber: number, fromAyah: number, toAyah: number): Promise<QuranAyah[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('surah_ayah');

      const range = IDBKeyRange.bound(
        [surahNumber, fromAyah],
        [surahNumber, toAyah],
        false,
        false
      );

      const request = index.getAll(range);

      request.onsuccess = () => {
        const results = request.result as QuranAyah[];
        console.log(`[IndexedDB] Retrieved ${results.length} ayahs for Surah ${surahNumber}, Ayahs ${fromAyah}-${toAyah}`);
        resolve(results);
      };

      request.onerror = () => {
        console.error('[IndexedDB] Failed to retrieve ayahs');
        reject(request.error);
      };
    });
  }

  async getSurah(surahNumber: number): Promise<QuranAyah[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('surah');

      const request = index.getAll(IDBKeyRange.only(surahNumber));

      request.onsuccess = () => {
        const results = request.result as QuranAyah[];
        console.log(`[IndexedDB] Retrieved ${results.length} ayahs for Surah ${surahNumber}`);
        resolve(results);
      };

      request.onerror = () => {
        console.error('[IndexedDB] Failed to retrieve surah');
        reject(request.error);
      };
    });
  }

  async checkIfCached(surahNumber: number, fromAyah: number, toAyah: number): Promise<boolean> {
    try {
      const ayahs = await this.getAyahsByRange(surahNumber, fromAyah, toAyah);
      const expectedCount = toAyah - fromAyah + 1;
      return ayahs.length === expectedCount;
    } catch (error) {
      console.error('[IndexedDB] Error checking cache:', error);
      return false;
    }
  }

  async clearAll(): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('[IndexedDB] All data cleared');
        resolve();
      };

      request.onerror = () => {
        console.error('[IndexedDB] Failed to clear data');
        reject(request.error);
      };
    });
  }

  async getCount(): Promise<number> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.count();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}

// Singleton instance
export const quranDB = new QuranIndexedDB();
