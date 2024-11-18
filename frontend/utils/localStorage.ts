export type StoredItem<T> = {
    value: T;
    expiry: number;
};

/**
 * Class to manage local storage operations with time-to-live (TTL) functionality and default keys.
 */
export class LocalStorageManager<K> {
    /**
     * Creates an instance of LocalStorageManager.
     * @param {string} DEFAULT_KEY - The default key to be used for storing and retrieving items.
     */
    constructor(public readonly DEFAULT_KEY: string) {}

    /**
     * Stores an item in the local storage with an optional time-to-live (TTL).
     *
     * @template K - The type of the value to be stored.
     * @param {string} key - The key under which the value is stored.
     * @param {K} value - The value to be stored.
     * @param {number} [ttl=0] - The time-to-live in seconds. If set to 0, the item will not expire.
     */
    static setItem<K>(key: string, value: K, ttl: number = 0) {
        const now = new Date();
        const item: StoredItem<K> = {
            value,
            expiry: ttl ? now.setSeconds(now.getSeconds() + ttl) : 0,
        };

        try {
            localStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            console.error('Error setting item in localStorage', error);
        }
    }

    /**
     * Stores an item in local storage with an optional time-to-live (TTL).
     *
     * @template K - The type of the value to be stored.
     * @param value - The value to be stored in local storage.
     * @param ttl - The time-to-live for the stored item in seconds. If set to 0, the item will not expire. Default is 0.
     */
    public setItem(value: K, ttl?: number) {
        LocalStorageManager.setItem(this.DEFAULT_KEY, value, ttl);
    }
    /**
     * Retrieves an item from local storage and parses it as JSON.
     * If the item has an expiry date and it has expired, the item is removed from local storage.
     *
     * @template K - The type of the item to be retrieved.
     * @param {string} key - The key of the item to retrieve from local storage.
     * @returns {K | null} - The parsed item if it exists and has not expired, otherwise null.
     */
    static getItem<K>(key: string): K | null {
        const item = localStorage.getItem(key);
        if (!item) return null;

        try {
            const parsed = JSON.parse(item) as StoredItem<K>;
            if (parsed.expiry && parsed.expiry < Date.now()) {
                console.debug('Item has expired, removing from localStorage');
                localStorage.removeItem(key);
                return null;
            }
            return parsed.value;
        } catch (error) {
            console.error('Error parsing item from localStorage', error);
            return null;
        }
    }

    public getItem(): K | null {
        return LocalStorageManager.getItem<K>(this.DEFAULT_KEY);
    }
    public clear() {
        localStorage.removeItem(this.DEFAULT_KEY);
    }
}
