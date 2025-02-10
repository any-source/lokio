import type { BOILERPLATE_OPTIONS_TYPE } from "@/configs/boilerplate";
import { readFileFromGithub } from "@/hooks/use_github";
import { log } from "@/utils/util-use";
import YAML from "yaml";

type GithubTypeResults = {
	GITHUB_MARKDOWN_INFO: string;
	CONFIG_YAML: (tmpl: string) => Promise<string>;
	GITHUB_VERSION: { major: number; minor: number; patch: number } | undefined;
	BOILERPLATE_YAML: BOILERPLATE_OPTIONS_TYPE[] | undefined;
	MAKE_YAML: Record<string, { label: string; value: string }[]> | undefined;
	FILENAME_YAML: Record<string, string> | undefined;
	FOLDERNAME_YAML: Record<string, string> | undefined;
	FILEDESCRIPTION_YAML: Record<string, string> | undefined;
	FILEFORMAT_YAML: Record<string, string> | undefined;
};

export const Github = async (): Promise<GithubTypeResults> => {
	try {
		const [
			versionRaw,
			boilerplateRaw,
			makeRaw,
			fileNameRaw,
			folderNameRaw,
			fileDescriptionRaw,
			fileFormatRaw,
			markdownInfo,
		] = await Promise.all([
			readFileFromGithub("version.json"),
			readFileFromGithub("cli/code.yaml"),
			readFileFromGithub("cli/make.yaml"),
			readFileFromGithub("cli/make/file-name.yaml"),
			readFileFromGithub("cli/make/folder-name.yaml"),
			readFileFromGithub("cli/make/file-description.yaml"),
			readFileFromGithub("cli/make/file-format.yaml"),
			readFileFromGithub("markdown/info.md"),
		]);

		const GITHUB_VERSION: GithubTypeResults["GITHUB_VERSION"] =
			JSON.parse(versionRaw);
		const BOILERPLATE_YAML: GithubTypeResults["BOILERPLATE_YAML"] =
			YAML.parse(boilerplateRaw);
		const MAKE_YAML: GithubTypeResults["MAKE_YAML"] = YAML.parse(makeRaw);
		const FILENAME_YAML: GithubTypeResults["FILENAME_YAML"] =
			YAML.parse(fileNameRaw);
		const FOLDERNAME_YAML: GithubTypeResults["FOLDERNAME_YAML"] =
			YAML.parse(folderNameRaw);
		const FILEDESCRIPTION_YAML: GithubTypeResults["FILEDESCRIPTION_YAML"] =
			YAML.parse(fileDescriptionRaw);
		const FILEFORMAT_YAML: GithubTypeResults["FILEFORMAT_YAML"] =
			YAML.parse(fileFormatRaw);

		const CONFIG_YAML = (tmpl: string) =>
			readFileFromGithub(`configs/${tmpl}.yaml`);

		return {
			GITHUB_MARKDOWN_INFO: markdownInfo,
			CONFIG_YAML,
			GITHUB_VERSION,
			BOILERPLATE_YAML,
			MAKE_YAML,
			FILENAME_YAML,
			FOLDERNAME_YAML,
			FILEDESCRIPTION_YAML,
			FILEFORMAT_YAML,
		};
	} catch (error) {
		log(error instanceof Error ? error.message : String(error));
		return {
			GITHUB_VERSION: undefined,
			GITHUB_MARKDOWN_INFO: "",
			CONFIG_YAML: async () => "",
			BOILERPLATE_YAML: undefined,
			MAKE_YAML: undefined,
			FILENAME_YAML: undefined,
			FOLDERNAME_YAML: undefined,
			FILEDESCRIPTION_YAML: undefined,
			FILEFORMAT_YAML: undefined,
		};
	}
};
