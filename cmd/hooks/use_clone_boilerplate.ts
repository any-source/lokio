import fs from "node:fs/promises";
import path from "node:path";
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
import { getDirFromGithub } from "./use_github";

export type SupportedLanguage = "ts" | "go" | "kt";

interface TemplateOptions {
	tmpl: string;
	projectName: string;
	install: boolean;
	lang: SupportedLanguage;
}

interface Paths {
	tempDir: string;
	projectDir: string;
	templatePath: string;
}

class TemplateManager {
	private readonly paths: Paths;
	private readonly options: TemplateOptions;

	constructor(options: TemplateOptions) {
		const cwd = process.cwd();
		this.options = options;
		this.paths = {
			tempDir: path.join(cwd, ".temp-clone"),
			projectDir: path.join(cwd, options.projectName),
			templatePath: path.join(cwd, ".temp-clone", "code", options.tmpl),
		};
	}

	private async ensureDirectory(dir: string): Promise<void> {
		try {
			await fs.mkdir(dir, { recursive: true });
		} catch (error) {
			throw new Error(
				`Failed to create directory ${dir}: ${(error as Error).message}`,
			);
		}
	}

	private async deleteDirectory(dir: string): Promise<void> {
		try {
			const entries = await fs.readdir(dir, { withFileTypes: true });
			for (const entry of entries) {
				const entryPath = path.join(dir, entry.name);
				if (entry.isDirectory()) {
					await this.deleteDirectory(entryPath);
				} else {
					await fs.unlink(entryPath);
				}
			}
			await fs.rmdir(dir);
		} catch (error) {
			log(chalk.yellow(`Failed to clean directory ${dir}: ${error}`));
		}
	}

	private async copyDirectory(src: string, dest: string): Promise<void> {
		try {
			await fs.mkdir(dest, { recursive: true });
			const entries = await fs.readdir(src, { withFileTypes: true });

			for (const entry of entries) {
				const srcPath = path.join(src, entry.name);
				const destPath = path.join(dest, entry.name);

				if (entry.isDirectory()) {
					await this.copyDirectory(srcPath, destPath);
				} else {
					await fs.copyFile(srcPath, destPath);
				}
			}
		} catch (error) {
			throw new Error(`Failed to copy directory: ${(error as Error).message}`);
		}
	}

	private async copyConfig(): Promise<void> {
		const { tmpl, projectName } = this.options;
		const destPath = path.join(this.paths.projectDir, ".lokio.yaml");
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

	private async processLanguageSpecific(): Promise<void> {
		const { lang, install } = this.options;
		const { projectDir } = this.paths;

		const handlers = {
			ts: async () => {
				await processFilesTypescript(projectDir, this.options.projectName);
				if (install) await installDependenciesTypescript(projectDir);
			},
			go: async () => {
				await processFilesGolang(projectDir, this.options.projectName);
				if (install) await installDependenciesGolang(projectDir);
			},
			kt: async () => {},
		};

		await handlers[lang]();
	}

	public async execute(): Promise<void> {
		const { tempDir, projectDir, templatePath } = this.paths;
		try {
			log(chalk.blue(TEXT.CLONE_PROJECT.START_SETUP));
			await this.deleteDirectory(tempDir);
			await this.ensureDirectory(projectDir);

			await getDirFromGithub(ENV.GUTHUB.LOKIO_TEMPLATE, tempDir);
			await this.copyDirectory(templatePath, projectDir);
			log(chalk.green(TEXT.CLONE_PROJECT.TEMPLATE_COPIED));

			await this.copyConfig();
			await this.processLanguageSpecific();

			await this.deleteDirectory(tempDir);
			log(chalk.green(TEXT.CLONE_PROJECT.SUCCESS(this.options.projectName)));
		} catch (error) {
			log(chalk.red(TEXT.CLONE_PROJECT.FAILURE));
			log(chalk.red((error as Error).message));
			await this.deleteDirectory(tempDir);
			throw error;
		}
	}
}

export default async function copyTemplate(
	options: TemplateOptions,
): Promise<void> {
	const manager = new TemplateManager(options);
	await manager.execute();
}
