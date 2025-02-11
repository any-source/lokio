import type { BOILERPLATE_OPTIONS_TYPE } from "@/configs/boilerplate";
import { readFileFromGithub } from "@/hooks/use_github";
import { log } from "@/utils/util-use";
import YAML from "yaml";

export type GithubTypeResults = {
	GITHUB_MARKDOWN_INFO: string;
	CONFIG_YAML: (tmpl: string) => Promise<string>;
	GITHUB_VERSION: { major: number; minor: number; patch: number } | undefined;
	BOILERPLATE_YAML: BOILERPLATE_OPTIONS_TYPE[] | undefined;
	MAKE_YAML: Record<string, { label: string; value: string }[]> | undefined;
	MAKECONFIG_YAML:
		| Record<
				string,
				{
					DEFAULT: string;
					description: string;
					extension: string;
					file_name: string;
					folder_name: string;
				}
		  >
		| undefined;
};

export const Github = async (): Promise<GithubTypeResults> => {
	try {
		const [versionRaw, boilerplateRaw, makeRaw, makeConfigRaw, markdownInfo] =
			await Promise.all([
				readFileFromGithub("cli/version.yaml"),
				readFileFromGithub("cli/code.yaml"),
				readFileFromGithub("cli/make.yaml"),
				readFileFromGithub("cli/make-config.yaml"),
				readFileFromGithub("markdown/info.md"),
			]);

		const GITHUB_VERSION: GithubTypeResults["GITHUB_VERSION"] =
		YAML.parse(versionRaw);
		const BOILERPLATE_YAML: GithubTypeResults["BOILERPLATE_YAML"] =
			YAML.parse(boilerplateRaw);
		const MAKE_YAML: GithubTypeResults["MAKE_YAML"] = YAML.parse(makeRaw);
		const MAKECONFIG_YAML: GithubTypeResults["MAKECONFIG_YAML"] =
			YAML.parse(makeConfigRaw);

		const CONFIG_YAML = (tmpl: string) =>
			readFileFromGithub(`configs/${tmpl}.yaml`);

		return {
			GITHUB_MARKDOWN_INFO: markdownInfo,
			CONFIG_YAML,
			GITHUB_VERSION,
			BOILERPLATE_YAML,
			MAKE_YAML,
			MAKECONFIG_YAML,
		};
	} catch (error) {
		log(error instanceof Error ? error.message : String(error));
		return {
			GITHUB_VERSION: undefined,
			GITHUB_MARKDOWN_INFO: "",
			CONFIG_YAML: async () => "",
			BOILERPLATE_YAML: undefined,
			MAKE_YAML: undefined,
			MAKECONFIG_YAML: undefined,
		};
	}
};
