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
	const tempDir = path.resolve(process.cwd(), ".temp-download"); // Use resolve to ensure absolute path
	try {
		// Ensure temp directory exists
		await fs.mkdir(tempDir, { recursive: true });

		// Download the template
		await downloadTemplate(githubUrl, {
			dir: tempDir,
			force: true,
		});

		// Use resolve to construct an absolute path to avoid relative path issues
		const fullPath = path.resolve(tempDir, filePath);
		const content = await fs.readFile(fullPath, "utf-8");

		// Cleanup the temporary directory after reading the file
		await fs.rm(tempDir, { recursive: true, force: true });

		return content;
	} catch (error) {
		console.error(
			chalk.red(
				`❌ Failed to read file ${filePath} from ${githubUrl}: ${(error as Error).message}`,
			),
		);
		// Clean up the temp directory even if an error occurs
		await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
		throw error;
	}
}
