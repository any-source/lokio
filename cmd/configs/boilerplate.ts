export type RESULTS_BOILERPLATE_TYPE = {
	value: string;
	label: string;
	hint?: string;
	status?: boolean;
	lang: string;
};
export type BOILERPLATE_OPTIONS_TYPE = {
	value: string;
	label: string;
	hint?: string;
	status?: boolean;
	lang?: string;
	children?: RESULTS_BOILERPLATE_TYPE[];
};
export const BOILERPLATE_OPTIONS: BOILERPLATE_OPTIONS_TYPE[] = [
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
		value: "angular",
		label: "Angular",
		hint: "The future of frontend development.",
		children: [
			{
				value: "angular-frontend",
				label: "[FE] - Frontend Angular",
				hint: "Cutting-edge frontend, simplified.",
				status: true,
				lang: "ts",
			},
		],
	},
	{
		value: "vue",
		label: "Vue",
		hint: "The lightning-fast frontend framework",
		children: [
			{
				value: "vue-frontend",
				label: "[FE] - Frontend Vue",
				hint: "Vue frontend for modern apps.",
				status: true,
				lang: "ts",
			},
			{
				value: "nuxt-frontend",
				label: "[FE] - Frontend Nuxt",
				hint: "Nuxt frontend for modern apps.",
				status: true,
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
				status: true,
				lang: "ts",
			},
			{
				value: "elysia-backend",
				label: "[BE] - Elysia Backend",
				hint: "Elegant, modern, and developer-friendly.",
				status: true,
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

export const BoilerplateShowLabel = (value: string): string => {
	const findLabel = (
		options: BOILERPLATE_OPTIONS_TYPE[],
	): string | undefined => {
		for (const item of options) {
			if (item.value === value) {
				return item.label;
			}
			if (item.children) {
				const childResult = findLabel(item.children);
				if (childResult) return childResult;
			}
		}
		return undefined;
	};
	return findLabel(BOILERPLATE_OPTIONS) || value;
};
