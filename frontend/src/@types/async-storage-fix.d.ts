declare module '@react-native-async-storage/async-storage' {
  export interface AsyncStorageStatic {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    // You can extend this with more methods as needed
  }

  const AsyncStorage: AsyncStorageStatic;
  export default AsyncStorage;
}
