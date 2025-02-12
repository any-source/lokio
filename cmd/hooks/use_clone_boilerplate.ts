import { readdirSync, renameSync, rmSync } from "node:fs";
import fs from "node:fs/promises";
import path, { join } from "node:path";
import { ENV } from "@/environment/main";
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
import chalk from "chalk";
import simpleGit from "simple-git";
import { processFilesKotlin } from "@/services/install/kotlin";
import { installDependenciesDart, processFilesDart } from "@/services/install/dart";
import { execCommand } from "@/services/exect-command";
import { installDependenciesRust, processFilesRust } from "@/services/install/rust";

export type SupportedLanguage = ".ts" | ".kt" | ".go" | ".vue" | ".js" | ".rust" | ".java";

interface TemplateOptions {
	tmpl: string;
	projectName: string;
	install: boolean;
	ejst: SupportedLanguage;
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
	ejst: SupportedLanguage,
	projectDir: string,
	projectName: string,
	install: boolean,
): Promise<void> {
	const handlers = {
		js: async () => {
			await processFilesTypescript(projectDir, projectName);
			if (install) await installDependenciesTypescript(projectDir);
		},
		ts: async () => {
			await processFilesTypescript(projectDir, projectName);
			if (install) await installDependenciesTypescript(projectDir);
		},
		vue: async () => {
			await processFilesTypescript(projectDir, projectName);
			if (install) await installDependenciesTypescript(projectDir);
		},
		go: async () => {
			await processFilesGolang(projectDir, projectName);
			if (install) await installDependenciesGolang(projectDir);
		},
		kt: async () => {
			await processFilesKotlin(projectDir, projectName);
		},
		java: async () => {
			await processFilesKotlin(projectDir, projectName);
		},
		dart: async () => {
			if (install) await installDependenciesDart(projectDir);
			await processFilesDart(projectDir, projectName);
		},
		rust: async () => {
			if (install) await installDependenciesRust(projectDir);
			await processFilesRust(projectDir, projectName);
		},
	};

	await handlers[ejst.slice(1) as keyof typeof handlers]();
}

const downloadTemplate = async (tmpl: string, projectName: string) => {
	const templatePath = join("code", tmpl);
	try {
		await simpleGit().clone(ENV.GUTHUB.LOKIO_TEMPLATE, projectName, [
			"--depth",
			"1",
			"--branch",
			"main",
			"--sparse",
			"--filter=blob:none",
		]);

		await simpleGit(projectName).raw(["sparse-checkout", "set", templatePath]);

		const templateFullPath = join(projectName, templatePath);
		const files = readdirSync(templateFullPath);
		for (const file of files) {
			renameSync(join(templateFullPath, file), join(projectName, file));
		}

		rmSync(join(projectName, "code"), { recursive: true });
		rmSync(join(projectName, ".git"), { recursive: true });
	} catch (error) {
		console.error("Failed:", error);
	}
};

export default async function copyTemplate(
	options: TemplateOptions,
): Promise<void> {
	const { tmpl, projectName, ejst, install } = options;

	try {
		log(chalk.blue(TEXT.CLONE_PROJECT.START_SETUP));
		await ensureDirectory(projectName);

		await downloadTemplate(tmpl, projectName);

		log(chalk.green(TEXT.CLONE_PROJECT.TEMPLATE_COPIED));

		// Copy and update configuration
		await copyConfig(tmpl, projectName);

		// Process language-specific files
		await processLanguageSpecific(ejst, projectName, projectName, install);

		await execCommand(
			"git init",
			"Initializing git repository...",
			projectName
		);
		log(chalk.green(TEXT.CLONE_PROJECT.SUCCESS(projectName)));
	} catch (error) {
		log(chalk.red(TEXT.CLONE_PROJECT.FAILURE));
		log(chalk.red((error as Error).message));
		throw error;
	}
}
