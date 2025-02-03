import fs from "node:fs/promises";
import path from "node:path";
import { ENV } from "@/environment/main";
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

	private async cleanDirectory(dir: string): Promise<void> {
		try {
			await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
		} catch (error) {
			log(chalk.yellow(`Warning: Failed to clean directory ${dir} : ${error}`));
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
			log(chalk.green("✓ Configuration file copied successfully"));
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === "ENOENT") {
				log(chalk.yellow(`⚠️ Configuration file not found: ${error}`));
				return;
			}
			throw new Error(
				`Failed to copy configuration: ${(error as Error).message}`,
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
			// Initial setup
			log(chalk.blue("🚀 Starting template setup..."));
			await this.cleanDirectory(tempDir);
			await this.ensureDirectory(projectDir);

			// Download and copy template
			await getDirFromGithub(ENV.GUTHUB.LOKIO_TEMPLATE, tempDir);
			await fs.cp(templatePath, projectDir, { recursive: true });
			log(chalk.green("✓ Template files copied"));

			// Process configuration and language-specific setup
			await this.copyConfig();
			await this.processLanguageSpecific();

			// Cleanup and finish
			await this.cleanDirectory(tempDir);
			log(
				chalk.green(
					`\n🎉 Success! Project ${this.options.projectName} is ready!`,
				),
			);
		} catch (error) {
			log(chalk.red("\n❌ Template creation failed:"));
			log(chalk.red((error as Error).message));
			await this.cleanDirectory(tempDir);
			throw error;
		}
	}
}

// Export the main function
export default async function copyTemplate(
	options: TemplateOptions,
): Promise<void> {
	const manager = new TemplateManager(options);
	await manager.execute();
}
