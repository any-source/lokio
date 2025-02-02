import fs from "node:fs/promises";
import path from "node:path";
import { downloadTemplate } from "@bluwy/giget-core";
import chalk from "chalk";

/**
 * Download entire directory from GitHub
 * @param githubUrl - URL to the GitHub repository or directory
 * @param tempDir - Temporary directory to store the downloaded files
 */
export async function getDirFromGithub(
	githubUrl: string,
	tempDir: string,
): Promise<void> {
	try {
		await fs.mkdir(tempDir, { recursive: true });
		await downloadTemplate(githubUrl, {
			dir: tempDir,
			force: true,
		});
	} catch (error) {
		console.error(
			chalk.red(
				`❌ Failed to download directory from ${githubUrl}: ${(error as Error).message}`,
			),
		);
		throw error;
	}
}

/**
 * Read file content from GitHub
 * @param githubUrl - URL to the GitHub repository or file
 * @param filePath - Path to the file within the repository
 * @returns Promise<string> - Content of the file
 */
export async function readFileFromGithub(
	githubUrl: string,
	filePath: string,
): Promise<string> {
	const tempDir = path.join(process.cwd(), ".temp-download");
	try {
		await fs.mkdir(tempDir, { recursive: true });
		await downloadTemplate(githubUrl, {
			dir: tempDir,
			force: true,
		});
		const fullPath = path.join(tempDir, filePath);
		const content = await fs.readFile(fullPath, "utf-8");
		await fs.rm(tempDir, { recursive: true, force: true });
		return content;
	} catch (error) {
		console.error(
			chalk.red(
				`❌ Failed to read file ${filePath} from ${githubUrl}: ${(error as Error).message}`,
			),
		);
		// Clean up temporary directory even if there's an error
		await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
		throw error;
	}
}
