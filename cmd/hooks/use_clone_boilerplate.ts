import fs from "node:fs/promises";
import path from "node:path";
import { filePath } from "@/configs/file-path";
import {
	installDependenciesGolang,
	processFilesGolang,
} from "@/services/install/golang";
import {
	installDependenciesTypescript,
	processFilesTypescript,
} from "@/services/install/typescript";
import { downloadTemplate } from "@bluwy/giget-core";
import chalk from "chalk";

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
			console.warn(chalk.yellow(`Warning: Failed to clean directory ${dir}`));
		}
	}

	private async copyConfig(): Promise<void> {
		const { tmpl, projectName } = this.options;
		const destPath = path.join(this.paths.projectDir, ".lokio.yaml");
		const configPath = filePath.config(`${tmpl}.yaml`);
		const file = Bun.file(configPath);
		const yamlContent = await file.text();
		try {
			const updatedContent = yamlContent.replace(
				/package:\s*.+/,
				`package: ${projectName}`,
			);
			await fs.writeFile(destPath, updatedContent, "utf8");
			console.log(chalk.green("✓ Configuration file copied successfully"));
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === "ENOENT") {
				console.warn(
					chalk.yellow(`⚠️ Configuration file not found: ${configPath}`),
				);
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
			console.log(chalk.blue("🚀 Starting template setup..."));
			await this.cleanDirectory(tempDir);
			await this.ensureDirectory(projectDir);

			// Download and copy template
			await downloadTemplate(
				"https://github.com/any-source/examples/tarball/main",
				{
					dir: tempDir,
					force: true,
				},
			);
			await fs.cp(templatePath, projectDir, { recursive: true });
			console.log(chalk.green("✓ Template files copied"));

			// Process configuration and language-specific setup
			await this.copyConfig();
			await this.processLanguageSpecific();

			// Cleanup and finish
			await this.cleanDirectory(tempDir);
			console.log(
				chalk.green(
					`\n🎉 Success! Project ${this.options.projectName} is ready!`,
				),
			);
		} catch (error) {
			console.error(chalk.red("\n❌ Template creation failed:"));
			console.error(chalk.red((error as Error).message));
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
