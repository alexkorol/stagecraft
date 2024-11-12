import { LOCAL_STORAGE_KEYS } from '../constants';

class StorageManager {
    constructor() {
        this.storageType = this.checkStorageAvailability();
    }

    // Check which storage type is available
    checkStorageAvailability() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return 'localStorage';
        } catch (e) {
            try {
                indexedDB.open('test');
                return 'indexedDB';
            } catch (e) {
                return 'memory';
            }
        }
    }

    // Save data to storage
    async save(key, data) {
        try {
            switch (this.storageType) {
                case 'localStorage':
                    localStorage.setItem(
                        key,
                        JSON.stringify({
                            data,
                            timestamp: Date.now()
                        })
                    );
                    break;
                case 'indexedDB':
                    await this.saveToIndexedDB(key, data);
                    break;
                case 'memory':
                    this.memoryStorage = this.memoryStorage || new Map();
                    this.memoryStorage.set(key, {
                        data,
                        timestamp: Date.now()
                    });
                    break;
            }
            return true;
        } catch (error) {
            console.error('Failed to save data:', error);
            return false;
        }
    }

    // Load data from storage
    async load(key) {
        try {
            switch (this.storageType) {
                case 'localStorage': {
                    const item = localStorage.getItem(key);
                    return item ? JSON.parse(item).data : null;
                }
                case 'indexedDB':
                    return await this.loadFromIndexedDB(key);
                case 'memory':
                    return this.memoryStorage?.get(key)?.data || null;
            }
        } catch (error) {
            console.error('Failed to load data:', error);
            return null;
        }
    }

    // Remove data from storage
    async remove(key) {
        try {
            switch (this.storageType) {
                case 'localStorage':
                    localStorage.removeItem(key);
                    break;
                case 'indexedDB':
                    await this.removeFromIndexedDB(key);
                    break;
                case 'memory':
                    this.memoryStorage?.delete(key);
                    break;
            }
            return true;
        } catch (error) {
            console.error('Failed to remove data:', error);
            return false;
        }
    }

    // Clear all data from storage
    async clear() {
        try {
            switch (this.storageType) {
                case 'localStorage':
                    localStorage.clear();
                    break;
                case 'indexedDB':
                    await this.clearIndexedDB();
                    break;
                case 'memory':
                    this.memoryStorage?.clear();
                    break;
            }
            return true;
        } catch (error) {
            console.error('Failed to clear storage:', error);
            return false;
        }
    }

    // IndexedDB specific methods
    async saveToIndexedDB(key, data) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('stagecraft', 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['projects'], 'readwrite');
                const store = transaction.objectStore('projects');

                const saveRequest = store.put({
                    key,
                    data,
                    timestamp: Date.now()
                });

                saveRequest.onsuccess = () => resolve(true);
                saveRequest.onerror = () => reject(saveRequest.error);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('projects')) {
                    db.createObjectStore('projects', { keyPath: 'key' });
                }
            };
        });
    }

    async loadFromIndexedDB(key) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('stagecraft', 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['projects'], 'readonly');
                const store = transaction.objectStore('projects');
                const getRequest = store.get(key);

                getRequest.onsuccess = () => resolve(getRequest.result?.data || null);
                getRequest.onerror = () => reject(getRequest.error);
            };
        });
    }

    async removeFromIndexedDB(key) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('stagecraft', 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['projects'], 'readwrite');
                const store = transaction.objectStore('projects');
                const deleteRequest = store.delete(key);

                deleteRequest.onsuccess = () => resolve(true);
                deleteRequest.onerror = () => reject(deleteRequest.error);
            };
        });
    }

    async clearIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('stagecraft', 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['projects'], 'readwrite');
                const store = transaction.objectStore('projects');
                const clearRequest = store.clear();

                clearRequest.onsuccess = () => resolve(true);
                clearRequest.onerror = () => reject(clearRequest.error);
            };
        });
    }

    // Utility methods
    async getStorageInfo() {
        const info = {
            type: this.storageType,
            available: true,
            size: 0,
            items: 0
        };

        try {
            switch (this.storageType) {
                case 'localStorage': {
                    info.size = new Blob(Object.values(localStorage)).size;
                    info.items = localStorage.length;
                    break;
                }
                case 'indexedDB': {
                    const db = await this.openIndexedDB();
                    const transaction = db.transaction(['projects'], 'readonly');
                    const store = transaction.objectStore('projects');
                    const countRequest = store.count();
                    info.items = await new Promise(resolve => {
                        countRequest.onsuccess = () => resolve(countRequest.result);
                    });
                    break;
                }
                case 'memory': {
                    info.items = this.memoryStorage?.size || 0;
                    break;
                }
            }
        } catch (error) {
            info.available = false;
            console.error('Failed to get storage info:', error);
        }

        return info;
    }

    // Helper method to open IndexedDB
    openIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('stagecraft', 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }
}

export default new StorageManager();
