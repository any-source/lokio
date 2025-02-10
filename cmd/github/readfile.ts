import type { BOILERPLATE_OPTIONS_TYPE } from "@/configs/boilerplate";
import { readFileFromGithub } from "@/hooks/use_github";
import { log } from "@/utils/util-use";
import YAML from "yaml";

type GithubTypeResults = {
	GITHUB_MARKDOWN_INFO: string;
	CONFIG_YAML: (tmpl: string) => Promise<string>;
	GITHUB_VERSION: { major: number; minor: number; patch: number } | undefined;
	BOILERPLATE_YAML: BOILERPLATE_OPTIONS_TYPE[] | undefined;
};

export const Github = async (): Promise<GithubTypeResults> => {
	try {
		const [versionRaw, boilerplateRaw, markdownInfo] = await Promise.all([
			readFileFromGithub("version.json"),
			readFileFromGithub("cli/code.yaml"),
			readFileFromGithub("markdown/info.md"),
		]);

		const GITHUB_VERSION: GithubTypeResults["GITHUB_VERSION"] = JSON.parse(versionRaw);
		const BOILERPLATE_YAML: GithubTypeResults["BOILERPLATE_YAML"] = YAML.parse(boilerplateRaw);

		const CONFIG_YAML = (tmpl: string) => readFileFromGithub(`configs/${tmpl}.yaml`);

		return {
			GITHUB_MARKDOWN_INFO: markdownInfo,
			CONFIG_YAML,
			GITHUB_VERSION,
			BOILERPLATE_YAML,
		};
	} catch (error) {
		log(error instanceof Error ? error.message : String(error));
		return {
			GITHUB_VERSION: undefined,
			GITHUB_MARKDOWN_INFO: "",
			CONFIG_YAML: async () => "",
			BOILERPLATE_YAML: undefined,
		};
	}
};
