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
	filesToRemove: ["CHANGELOG.md", ".codesandbox"],
	fileUpdaters: {
		"package.json": async (file: string, { name }: FileUpdateOptions) => {
			const content = await fs.readFile(file, "utf-8");
			const indent = /(^\s+)/m.exec(content)?.[1] ?? "  ";

			const packageJson = JSON.parse(content);
			const updatedJson = {
				...packageJson,
				name,
				private: undefined,
			};

			await fs.writeFile(
				file,
				`${JSON.stringify(updatedJson, null, indent)}\n`,
				"utf-8",
			);
		},
	},
};

class TypeScriptProjectProcessor {
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

	private async execCommand(command: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const spinner = this.createSpinner("Installing dependencies...");
			spinner.start();

			const process = exec(command, { cwd: this.projectDir });

			process.stdout?.on("data", (data) => {
				spinner.text = `Installing... ${chalk.dim(data.toString().trim())}`;
			});

			process.stderr?.on("data", (data) => {
				spinner.text = `Installing... ${chalk.yellow(data.toString().trim())}`;
			});

			process.on("close", (code) => {
				if (code === 0) {
					spinner.stop();
					info("Success", "Dependencies installed successfully");
					resolve();
				} else {
					spinner.fail(chalk.red("Installation failed"));
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
			await this.execCommand("bun install");
		} catch (error) {
			throw new Error(
				`Failed to install dependencies: ${(error as Error).message}`,
			);
		}
	}

	public async processFiles(): Promise<void> {
		try {
			await this.removeFiles();
			await this.updateFiles();
		} catch (error) {
			throw new Error(
				`Failed to process project files: ${(error as Error).message}`,
			);
		}
	}
}

export async function installDependenciesTypescript(
	projectDir: string,
): Promise<void> {
	const processor = new TypeScriptProjectProcessor(projectDir, "");
	await processor.installDependencies();
}

export async function processFilesTypescript(
	projectDir: string,
	projectName: string,
): Promise<void> {
	const processor = new TypeScriptProjectProcessor(projectDir, projectName);
	await processor.processFiles();
}
