type PrimitiveType = string | number | boolean | null | undefined;
type ArrayType = PrimitiveType[] | object[];
type ComplexType = object | ArrayType;
type ContextValue = PrimitiveType | ComplexType;
type ContextKey = string | symbol;

const context: Map<ContextKey, ContextValue> = new Map();

export const setContext = <T extends ContextValue>(
	key: ContextKey,
	value: T,
): void => {
	context.set(key, value);
};

export const getContext = <T extends ContextValue>(
	key: ContextKey,
): T | undefined => {
	const value = context.get(key);
	if (value === undefined) return undefined;
	if (typeof value !== typeof ({} as T)) {
		throw new Error("Type mismatch: stored value is not of requested type T");
	}

	return value as T;
};

export const deleteContext = (key: ContextKey): void => {
	context.delete(key);
};

export const hasContext = (key: ContextKey): boolean => {
	return context.has(key);
};

export const clearContext = (): void => {
	context.clear();
};
