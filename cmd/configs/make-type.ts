export const FILE_TYPES = {
	CALL: "call",
	COMPONENT: "component",
	CONTROLLER: "controller",
	HOOK: "hook",
	LAYOUT: "layout",
	SCHEMA: "schema",
	SCREEN: "screen",
	MIDDLEWARE: "middleware",
	SERVICE: "service",
	SHARED: "shared",
	// GOLANG
	GO_CONTROLLER: "go-controller",
	// KOTLIN
	KT_FEATURE: "kt-feature",
};
export const DEFAULT_MAPPINGS: Record<
	string,
	{ value: string; label: string }[]
> = {
	"next-monolith": [
		{ value: FILE_TYPES.HOOK, label: "Hook" },
		{ value: FILE_TYPES.CALL, label: "Call" },
		{ value: FILE_TYPES.COMPONENT, label: "Component" },
		{ value: FILE_TYPES.SCREEN, label: "Screen" },
		{ value: FILE_TYPES.LAYOUT, label: "Layout" },
		{ value: FILE_TYPES.CONTROLLER, label: "Controller" },
		{ value: FILE_TYPES.MIDDLEWARE, label: "Middleware" },
		{ value: FILE_TYPES.SERVICE, label: "Service" },
	],
	"next-frontend": [
		{ value: FILE_TYPES.HOOK, label: "Hook" },
		{ value: FILE_TYPES.CALL, label: "Call" },
		{ value: FILE_TYPES.COMPONENT, label: "Component" },
		{ value: FILE_TYPES.SCREEN, label: "Screen" },
		{ value: FILE_TYPES.LAYOUT, label: "Layout" },
	],
	"astro-frontend": [
		{ value: FILE_TYPES.HOOK, label: "Hook" },
		{ value: FILE_TYPES.CALL, label: "Call" },
		{ value: FILE_TYPES.COMPONENT, label: "Component" },
		{ value: FILE_TYPES.SCREEN, label: "Screen" },
		{ value: FILE_TYPES.LAYOUT, label: "Layout" },
	],
	"angular-frontend": [{ value: FILE_TYPES.HOOK, label: "Hook" }],
	"vue-frontend": [{ value: FILE_TYPES.HOOK, label: "Hook" }],
	"nuxt-frontend": [{ value: FILE_TYPES.HOOK, label: "Hook" }],
	"hono-backend": [{ value: FILE_TYPES.HOOK, label: "Hook" }],
	"go-backend": [{ value: FILE_TYPES.GO_CONTROLLER, label: "Controller" }],
	"kt-mobile": [{ value: FILE_TYPES.KT_FEATURE, label: "Feature" }],
};
