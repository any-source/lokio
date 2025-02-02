import { ENV } from "@/environment/main";
import { readFileFromGithub } from "@/hooks/use_github";

type GithubTypeResults = {
	GITHUB_MARKDOWN_INFO: string;
	CONFIG_YAML: (tmpl: string) => Promise<string>;
};
export const Github = async (): Promise<GithubTypeResults> => {
	try {
		const GITHUB_MARKDOWN_INFO = await readFileFromGithub("markdown/info.md");
		const CONFIG_YAML = async (tmpl: string) =>
			await readFileFromGithub(`configs/${tmpl}.yaml`);
		return {
			GITHUB_MARKDOWN_INFO,
			CONFIG_YAML,
		};
	} catch (error) {
		console.log(error);
		return {
			GITHUB_MARKDOWN_INFO: "",
			CONFIG_YAML: async () => "",
		};
	}
};
