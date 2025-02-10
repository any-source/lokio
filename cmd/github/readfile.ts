import type { BOILERPLATE_OPTIONS_TYPE } from "@/configs/boilerplate";
import { readFileFromGithub } from "@/hooks/use_github";
import { log } from "@/utils/util-use";
import YAML from "yaml";

type GithubTypeResults = {
	GITHUB_MARKDOWN_INFO: string;
	CONFIG_YAML: (tmpl: string) => Promise<string>;
	GITHUB_VERSION: { major: number; minor: number; patch: number } | undefined;
	BOILERPLATE_YAML: BOILERPLATE_OPTIONS_TYPE[] | undefined;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	MAKE_YAML: any | undefined
};

export const Github = async (): Promise<GithubTypeResults> => {
	try {
		const [versionRaw, boilerplateRaw, makeRaw, markdownInfo] = await Promise.all([
			readFileFromGithub("version.json"),
			readFileFromGithub("cli/code.yaml"),
			readFileFromGithub("cli/make.yaml"),
			readFileFromGithub("markdown/info.md"),
		]);

		const GITHUB_VERSION: GithubTypeResults["GITHUB_VERSION"] = JSON.parse(versionRaw);
		const BOILERPLATE_YAML: GithubTypeResults["BOILERPLATE_YAML"] = YAML.parse(boilerplateRaw);
		const MAKE_YAML: GithubTypeResults["MAKE_YAML"] = YAML.parse(makeRaw);

		const CONFIG_YAML = (tmpl: string) => readFileFromGithub(`configs/${tmpl}.yaml`);

		return {
			GITHUB_MARKDOWN_INFO: markdownInfo,
			CONFIG_YAML,
			GITHUB_VERSION,
			BOILERPLATE_YAML,
			MAKE_YAML
		};
	} catch (error) {
		log(error instanceof Error ? error.message : String(error));
		return {
			GITHUB_VERSION: undefined,
			GITHUB_MARKDOWN_INFO: "",
			CONFIG_YAML: async () => "",
			BOILERPLATE_YAML: undefined,
			MAKE_YAML: undefined
		};
	}
};
