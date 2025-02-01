import { exec } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { info } from "@/interfaces/info";
import chalk from "chalk";
import ora from "ora";

interface FileUpdateOptions {
	name: string;
}

type FileUpdater = (file: string, options: FileUpdateOptions) => Promise<void>;

interface ProjectConfig {
	filesToRemove: string[];
	fileUpdaters: Record<string, FileUpdater>;
}

const PROJECT_CONFIG: ProjectConfig = {
	filesToRemove: ["CHANGELOG.md", ".codesandbox", "go.sum"],
	fileUpdaters: {
		"go.mod": async (file: string, { name }: FileUpdateOptions) => {
			const content = await fs.readFile(file, "utf-8");
			const updatedContent = content.replace(/module\s+.+/, `module ${name}`);
			await fs.writeFile(file, updatedContent, "utf-8");
		},
	},
};

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
		const removePromises = PROJECT_CONFIG.filesToRemove.map(async (file) => {
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
		const updatePromises = Object.entries(PROJECT_CONFIG.fileUpdaters).map(
			async ([file, updater]) => {
				const filePath = path.resolve(this.projectDir, file);
				try {
					const exists = await fs
						.access(filePath)
						.then(() => true)
						.catch(() => false);

					if (exists) {
						await updater(filePath, { name: this.projectName });
					}
				} catch (error) {
					throw new Error(
						`Failed to update ${file}: ${(error as Error).message}`,
					);
				}
			},
		);

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
