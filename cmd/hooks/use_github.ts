import { ENV } from "@/environment/main";
import chalk from "chalk";

/**
 * Read file content directly from GitHub using raw content URL
 * @param githubUrl - URL to the GitHub repository
 * @param filePath - Path to the file within the repository
 * @returns Promise<string> - Content of the file
 */
export async function readFileFromGithub(filePath: string): Promise<string> {
	try {
		// Convert github URL to raw content URL
		const rawUrl = convertToRawUrl(filePath);

		// Fetch the content directly
		const response = await fetch(rawUrl);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const content = await response.text();
		return content;
	} catch (error) {
		console.error(
			chalk.red(
				`❌ Failed to read file ${filePath} ${(error as Error).message}`,
			),
		);
		throw error;
	}
}

/**
 * Convert GitHub URL to raw content URL
 * @param githubUrl - URL to the GitHub repository
 * @param filePath - Path to the file within the repository
 * @returns string - Raw content URL
 */
function convertToRawUrl(filePath: string): string {
	return `${ENV.GUTHUB.LOKIO_GITHUB_URL}/${filePath}`;
}
