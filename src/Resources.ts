
export default class Database {

  public static async getDB(database: string | IDBDatabase) {
    if (typeof database === "string") {
      const dbReq = indexedDB.open(database);
      const db = (await new Promise(
        (r) =>
          (dbReq.onsuccess = (e) =>
            r((e.target! as unknown as { result: IDBDatabase }).result))
      )) as IDBDatabase;
      return db;
    } else {
      return database;
    }
  }

  public static async open(database: string, onupgradeneeded?: (db: IDBDatabase) => void) {
    const dbReq = indexedDB.open(database);
    dbReq.onupgradeneeded = (e) => {
      const db = (e.target! as unknown as { result: IDBDatabase }).result;
      onupgradeneeded?.(db);
    };
    return await (new Promise(r => dbReq.onsuccess = e => r((e.target! as unknown as { result: IDBDatabase }).result))) as IDBDatabase;
  }

  public static async getStore(database: string | IDBDatabase, table: string, access: "readonly" | "readwrite" = "readonly") {
    const db = await Database.getDB(database);
    const tx = db.transaction([table], access);
    const store = tx.objectStore(table);
    return store;
  }

  public static async get<T>(database: string | IDBDatabase, table: string, key: string, defaultValue?: T): Promise<T> {
    const store = await Database.getStore(database, table);
    if (!key) return defaultValue as T;
    const req = store.get(key);
    return await new Promise((r) => {
      req.onerror = () =>  r(defaultValue as T);
      req.onsuccess = () => r(req.result as T ?? defaultValue as T);
    });
  }

  public static async getAllKeys(database: string | IDBDatabase, table: string): Promise<string[]> {
    const store = await Database.getStore(database, table);
    const req = store.getAllKeys();
    return await new Promise(
      (r) => (req.onsuccess = () => r(req.result as string[]))
    );
  }

  public static async put(database: string | IDBDatabase, table: string, key: string, value: unknown) {
    const store = await Database.getStore(database, table, "readwrite");
    const req = store.put(value, key);
    await new Promise((r) => (req.onsuccess = () => r(undefined)));
  }

}