import YAML from 'yaml';
import { exec } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { info } from "@/interfaces/info";
import chalk from "chalk";
import ora from "ora";
import { readFileFromGithub } from "@/hooks/use_github";
import { getContext } from "@/context/main";
import { CONTEXT_KEY } from "@/configs/context-key";
import { log } from '@/utils/util-use';

class GolangProjectProcessor {
	private readonly projectDir: string;
	private readonly projectName: string;

	constructor(projectDir: string, projectName: string) {
		this.projectDir = projectDir;
		this.projectName = projectName;
	}

	private createSpinner(message: string) {
		return ora({
			text: chalk.dim(message),
			spinner: "dots",
		});
	}

	private async execCommand(
		command: string,
		spinnerMessage: string,
	): Promise<void> {
		return new Promise((resolve, reject) => {
			const spinner = this.createSpinner(spinnerMessage);
			spinner.start();

			const process = exec(command, { cwd: this.projectDir });

			process.stdout?.on("data", (data) => {
				spinner.text = `${spinnerMessage} ${chalk.dim(data.toString().trim())}`;
			});

			process.stderr?.on("data", (data) => {
				spinner.text = `${spinnerMessage} ${chalk.yellow(data.toString().trim())}`;
			});

			process.on("close", (code) => {
				if (code === 0) {
					spinner.stop();
					info("Success", "Go dependencies installed successfully");
					resolve();
				} else {
					spinner.fail(chalk.red("Go dependency installation failed"));
					reject(new Error(`Installation failed with code ${code}`));
				}
			});
		});
	}

	private async removeFiles(): Promise<void> {
		const PKG_NAME = getContext(CONTEXT_KEY.COMMAND.BOILERPLATE);
		if (PKG_NAME === null) {
			throw new Error("PKG_NAME is null");
		}
		const pkgNameValue = typeof PKG_NAME === 'object' && 'value' in PKG_NAME ? PKG_NAME.value : PKG_NAME;
		const file = await readFileFromGithub(`package/${pkgNameValue}.yaml`)
		const results = YAML.parse(file)?.files_remove
		const removePromises = results?.map(async (file: string) => {
			const filePath = path.resolve(this.projectDir, file);
			try {
				await fs.rm(filePath, { recursive: true, force: true });
			} catch (error) {
				if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
					throw error;
				}
			}
		});

		await Promise.all(removePromises);
	}

	private async updateFiles(): Promise<void> {
		const PKG_NAME = getContext(CONTEXT_KEY.COMMAND.BOILERPLATE);
		if (PKG_NAME === null) {
			throw new Error("PKG_NAME is null");
		}
	
		const pkgNameValue = typeof PKG_NAME === "object" && "value" in PKG_NAME ? PKG_NAME.value : PKG_NAME;
		const file = await readFileFromGithub(`package/${pkgNameValue}.yaml`);
		const yamlConfig = YAML.parse(file);
		const filesReplacePackage = yamlConfig?.files_replace_package;
	
		if (!filesReplacePackage || typeof filesReplacePackage !== 'object') {
			throw new Error("Invalid or missing files_replace_package in YAML");
		}
	
		const updatePromises = Object.entries(filesReplacePackage).map(async ([filePath, config]) => {
			if (!config || typeof config !== 'object' || !('patterns' in config) || !Array.isArray(config.patterns)) {
				throw new Error(`Invalid configuration for file: ${filePath}`);
			}
	
			const fullPath = path.resolve(this.projectDir, filePath);
			
			try {
				const exists = await fs
					.access(fullPath)
					.then(() => true)
					.catch(() => false);
	
				if (!exists) {
					console.warn(`File not found: ${fullPath}`);
					return;
				}
	
				let content = await fs.readFile(fullPath, "utf-8");
	
				for (const pattern of config.patterns) {
					if (!(pattern.regex && pattern.replace)) {
						throw new Error(`Invalid pattern configuration for file: ${filePath}`);
					}
	
					const compiledRegex = new RegExp(pattern.regex, "g");
					const replacedString = pattern.replace.replace("${name}", this.projectName);
					content = content.replace(compiledRegex, replacedString);
				}
	
				await fs.writeFile(fullPath, content, "utf-8");
				log(`Successfully updated: ${filePath}`);
			} catch (error) {
				throw new Error(`Failed to update ${filePath}: ${(error as Error).message}`);
			}
		});
	
		await Promise.all(updatePromises);
	}


	public async installDependencies(): Promise<void> {
		try {
			await this.execCommand(
				"go mod tidy",
				"Wait a moment, installing Go dependencies...",
			);
		} catch (error) {
			throw new Error(
				`Failed to install Go dependencies: ${(error as Error).message}`,
			);
		}
	}

	public async processFiles(): Promise<void> {
		try {
			await this.removeFiles();
			await this.updateFiles();
		} catch (error) {
			throw new Error(
				`Failed to process Go project files: ${(error as Error).message}`,
			);
		}
	}
}

export async function installDependenciesGolang(
	projectDir: string,
): Promise<void> {
	const processor = new GolangProjectProcessor(projectDir, "");
	await processor.installDependencies();
}

export async function processFilesGolang(
	projectDir: string,
	projectName: string,
): Promise<void> {
	const processor = new GolangProjectProcessor(projectDir, projectName);
	await processor.processFiles();
}
