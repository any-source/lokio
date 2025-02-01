// context.ts

// Definisi tipe untuk nilai yang bisa disimpan di context
type PrimitiveType = string | number | boolean | null | undefined;
type ArrayType = PrimitiveType[] | object[];
type ComplexType = object | ArrayType;
type ContextValue = PrimitiveType | ComplexType;
type ContextKey = string | symbol;

const context: Map<ContextKey, ContextValue> = new Map();

/**
 * Menyimpan nilai ke dalam context.
 * @param key - Key untuk menyimpan nilai.
 * @param value - Nilai yang akan disimpan.
 */
export const setContext = <T extends ContextValue>(key: ContextKey, value: T): void => {
  context.set(key, value);
};

/**
 * Mengambil nilai dari context berdasarkan key.
 * @param key - Key untuk mengambil nilai.
 * @returns Nilai yang tersimpan atau `undefined` jika key tidak ditemukan.
 * @throws Error jika tipe yang diminta tidak sesuai dengan nilai yang tersimpan
 */
export const getContext = <T extends ContextValue>(key: ContextKey): T | undefined => {
  const value = context.get(key);
  if (value === undefined) return undefined;
  
  // Type checking untuk memastikan nilai yang diambil sesuai dengan tipe yang diminta
  if (typeof value !== typeof ({} as T)) {
    throw new Error(`Type mismatch: stored value is not of requested type T`);
  }
  
  return value as T;
};

/**
 * Menghapus nilai dari context berdasarkan key.
 * @param key - Key untuk menghapus nilai.
 */
export const deleteContext = (key: ContextKey): void => {
  context.delete(key);
};

/**
 * Mengecek apakah key ada di dalam context.
 * @param key - Key yang akan dicek.
 * @returns `true` jika key ada, `false` jika tidak.
 */
export const hasContext = (key: ContextKey): boolean => {
  return context.has(key);
};

/**
 * Membersihkan semua data di dalam context.
 */
export const clearContext = (): void => {
  context.clear();
};