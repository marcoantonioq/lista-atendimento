/* eslint-disable @typescript-eslint/no-explicit-any */
class LocalStorageManager {
  private storage: Storage;

  constructor(storage: Storage = localStorage) {
    this.storage = storage;
  }

  saveItem(key: string, data: any): void {
    try {
      const serializedData = JSON.stringify(data);
      this.storage.setItem(key, serializedData);
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage: ${error}`);
    }
  }

  getItem(key: string, defaultValue: any = null): any {
    try {
      const serializedData = this.storage.getItem(key);
      if (serializedData === null) {
        return defaultValue;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error(`Erro ao recuperar ${key} do localStorage: ${error}`);
      return defaultValue;
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao remover ${key} do localStorage: ${error}`);
    }
  }

  clearStorage(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error("Erro ao limpar o localStorage: ${error}");
    }
  }
}

export const storage = new LocalStorageManager();
