import { Github } from "@/github/readfile";

export type RESULTS_BOILERPLATE_TYPE = {
	value: string;
	label: string;
	hint?: string;
	status?: boolean;
	ejst: string;
};
export type BOILERPLATE_OPTIONS_TYPE = {
	value: string;
	label: string;
	hint?: string;
	status?: boolean;
	ejst?: string;
	children?: RESULTS_BOILERPLATE_TYPE[];
};

export const BOILERPLATE = async (): Promise<BOILERPLATE_OPTIONS_TYPE[]> => {
	const data = await Github();
	return data.BOILERPLATE_YAML || []
}

export const BoilerplateShowLabel = (BOILERPLATE_OPTIONS: BOILERPLATE_OPTIONS_TYPE[], value: string): string => {
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
