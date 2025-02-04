export type RESULTS_PROJECT_TYPE = {
	value: string;
	label: string;
	hint?: string;
	status?: boolean;
	lang: string;
};
export type PROJECT_OPTIONS_TYPE = {
	value: string;
	label: string;
	hint?: string;
	status?: boolean;
	lang?: string;
	children?: RESULTS_PROJECT_TYPE[];
};
export const PROJECT_OPTIONS: PROJECT_OPTIONS_TYPE[] = [
	{
		value: "react",
		label: "React",
		hint: "The heart of modern frontend development.",
		children: [
			{
				value: "next-monolith",
				label: "[MN] - Monolith NextJs",
				hint: "Monolithic architecture, modern speed.",
				status: true,
				lang: "ts",
			},
			{
				value: "next-frontend",
				label: "[FE] - Frontend NextJs",
				hint: "Cutting-edge frontend, simplified.",
				status: false,
				lang: "ts",
			},
		],
	},
	{
		value: "bun",
		label: "Bun",
		hint: "Modern, fast, all-in-one JS runtime.",
		children: [
			{
				value: "hono-backend",
				label: "[BE] - Hono Backend",
				hint: "Lightning-fast backend for modern apps.",
				status: false,
				lang: "ts",
			},
			{
				value: "elysia-backend",
				label: "[BE] - Elysia Backend",
				hint: "Elegant, modern, and developer-friendly.",
				status: false,
				lang: "ts",
			},
		],
	},
	{
		value: "golang",
		label: "Golang",
		hint: "Powerful, efficient, and secure.",
		children: [
			{
				value: "go-backend",
				label: "[BE] - Golang Backend",
				hint: "Lightning-fast backend for modern apps.",
				status: true,
				lang: "go",
			},
		],
	},
	{
		value: "kotlin",
		label: "Kotlin",
		hint: "The future of Android development.",
		children: [
			{
				value: "kt-mobile-compose-mvvm",
				label: "[MB] - Kotlin Mobile MVVM",
				hint: "Kotlin MVVM for mobile apps",
				status: true,
				lang: "kt",
			},
		],
	},
];
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
		{ value: FILE_TYPES.SHARED, label: "Shared" },
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
		{ value: FILE_TYPES.SHARED, label: "Shared" },
		{ value: FILE_TYPES.CALL, label: "Call" },
		{ value: FILE_TYPES.COMPONENT, label: "Component" },
		{ value: FILE_TYPES.SCREEN, label: "Screen" },
		{ value: FILE_TYPES.LAYOUT, label: "Layout" },
	],
	"astro-frontend": [
		{ value: FILE_TYPES.HOOK, label: "Hook" },
		{ value: FILE_TYPES.SHARED, label: "Shared" },
		{ value: FILE_TYPES.CALL, label: "Call" },
		{ value: FILE_TYPES.COMPONENT, label: "Component" },
		{ value: FILE_TYPES.SCREEN, label: "Screen" },
		{ value: FILE_TYPES.LAYOUT, label: "Layout" },
	],
	"hono-backend": [{ value: FILE_TYPES.HOOK, label: "Hook" }],
	"go-backend": [{ value: FILE_TYPES.GO_CONTROLLER, label: "Controller" }],
	"kt-mobile": [{ value: FILE_TYPES.KT_FEATURE, label: "Feature" }],
};
