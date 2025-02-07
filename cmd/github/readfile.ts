import { readFileFromGithub } from "@/hooks/use_github";
import { log } from "@/utils/util-use";

type GithubTypeResults = {
	GITHUB_MARKDOWN_INFO: string;
	CONFIG_YAML: (tmpl: string) => Promise<string>;
	GITHUB_VERSION: { major: number; minor: number; patch: number } | undefined;
};
export const Github = async (): Promise<GithubTypeResults> => {
	try {
		const GITHUB_VERSION_RAW = await readFileFromGithub("version.json");
		const GITHUB_VERSION = JSON.parse(GITHUB_VERSION_RAW);

		const GITHUB_MARKDOWN_INFO = await readFileFromGithub("markdown/info.md");
		const CONFIG_YAML = async (tmpl: string) =>
			await readFileFromGithub(`configs/${tmpl}.yaml`);
		return {
			GITHUB_MARKDOWN_INFO,
			CONFIG_YAML,
			GITHUB_VERSION,
		};
	} catch (error) {
		if (error instanceof Error) {
			log(error.message);
		} else {
			log(String(error));
		}
		return {
			GITHUB_VERSION: undefined,
			GITHUB_MARKDOWN_INFO: "",
			CONFIG_YAML: async () => "",
		};
	}
};
