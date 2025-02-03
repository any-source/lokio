import fs from "node:fs/promises";
import path from "node:path";
import { TEXT } from "@/environment/text";
import { Github } from "@/github/readfile";
import {
	installDependenciesGolang,
	processFilesGolang,
} from "@/services/install/golang";
import {
	installDependenciesTypescript,
	processFilesTypescript,
} from "@/services/install/typescript";
import { log } from "@/utils/util-use";
import { downloadTemplate } from "@bluwy/giget-core";
import chalk from "chalk";

export type SupportedLanguage = "ts" | "go" | "kt";

interface TemplateOptions {
	tmpl: string;
	projectName: string;
	install: boolean;
	lang: SupportedLanguage;
}

async function ensureDirectory(dir: string): Promise<void> {
	try {
		await fs.mkdir(dir, { recursive: true });
	} catch (error) {
		throw new Error(
			`Failed to create directory ${dir}: ${(error as Error).message}`,
		);
	}
}

async function copyConfig(tmpl: string, projectName: string): Promise<void> {
	const destPath = path.join(projectName, ".lokio.yaml");
	try {
		const { CONFIG_YAML } = await Github();
		const yamlContent = await CONFIG_YAML(tmpl);
		const updatedContent = yamlContent.replace(
			/package:\s*.+/,
			`package: ${projectName}`,
		);
		await fs.writeFile(destPath, updatedContent, "utf8");
		log(chalk.green(TEXT.CLONE_PROJECT.CONFIG_COPY_SUCCESS));
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") {
			log(chalk.yellow(`${TEXT.CLONE_PROJECT.CONFIG_NOT_FOUND}: ${error}`));
			return;
		}
		throw new Error(
			`${TEXT.CLONE_PROJECT.CONFIG_COPY_FAILED}: ${(error as Error).message}`,
		);
	}
}

async function processLanguageSpecific(
	lang: SupportedLanguage,
	projectDir: string,
	projectName: string,
	install: boolean,
): Promise<void> {
	const handlers = {
		ts: async () => {
			await processFilesTypescript(projectDir, projectName);
			if (install) await installDependenciesTypescript(projectDir);
		},
		go: async () => {
			await processFilesGolang(projectDir, projectName);
			if (install) await installDependenciesGolang(projectDir);
		},
		kt: async () => {},
	};

	await handlers[lang]();
}

export default async function copyTemplate(
	options: TemplateOptions,
): Promise<void> {
	const { tmpl, projectName, lang, install } = options;

	try {
		log(chalk.blue(TEXT.CLONE_PROJECT.START_SETUP));
		await ensureDirectory(projectName);

		// Download template using giget-core
		// Format: owner/repo/subdir#ref
		const templatePath = `any-source/examples/code/${tmpl}#main`;
		await downloadTemplate(templatePath, {
			dir: projectName,
			force: true,
		});
		log(chalk.green(TEXT.CLONE_PROJECT.TEMPLATE_COPIED));

		// Copy and update configuration
		await copyConfig(tmpl, projectName);

		// Process language-specific files
		await processLanguageSpecific(lang, projectName, projectName, install);

		log(chalk.green(TEXT.CLONE_PROJECT.SUCCESS(projectName)));
	} catch (error) {
		log(chalk.red(TEXT.CLONE_PROJECT.FAILURE));
		log(chalk.red((error as Error).message));
		throw error;
	}
}
