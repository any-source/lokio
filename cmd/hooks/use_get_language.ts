import { BOILERPLATE_OPTIONS } from "@/configs/boilerplate";

export const EjsFolder = (lang: string): string => {
	switch (lang) {
		case "ts":
			return "typescript";
		case "kt":
			return "kotlin";
		case "go":
			return "golang";
		default:
			return "";
	}
};

export const useGetLanguage = (value: string): string => {
	for (const project of BOILERPLATE_OPTIONS) {
		if (project.value === value && project.lang) {
			return project.lang;
		}
		if (project.children) {
			for (const child of project.children) {
				if (child.value === value) {
					return child.lang || "";
				}
			}
		}
	}
	return "";
};
