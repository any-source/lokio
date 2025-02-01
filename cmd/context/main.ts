type PrimitiveType = string | number | boolean | null | undefined;
type ArrayType = PrimitiveType[] | object[];
type ComplexType = object | ArrayType;
type ContextValue = PrimitiveType | ComplexType;
type ContextKey = string | symbol;

const context: Map<ContextKey, ContextValue> = new Map();

/**
 * Stores a value in the context.
 * @param key - The key to store the value under.
 * @param value - The value to store.
 */
export const setContext = <T extends ContextValue>(
	key: ContextKey,
	value: T,
): void => {
	context.set(key, value);
};

/**
 * Retrieves a value from the context.
 * @param key - The key to retrieve the value for.
 * @returns The stored value or `undefined` if the key does not exist.
 */
export const getContext = <T extends ContextValue>(
	key: ContextKey,
): T | undefined => {
	const value = context.get(key);
	if (value === undefined) return undefined;

	// Return the value as the requested type.
	// Note: This assumes the caller knows the correct type.
	return value as T;
};

/**
 * Deletes a value from the context.
 * @param key - The key to delete.
 */
export const deleteContext = (key: ContextKey): void => {
	context.delete(key);
};

/**
 * Checks if a key exists in the context.
 * @param key - The key to check.
 * @returns `true` if the key exists, `false` otherwise.
 */
export const hasContext = (key: ContextKey): boolean => {
	return context.has(key);
};

/**
 * Clears all values from the context.
 */
export const clearContext = (): void => {
	context.clear();
};
