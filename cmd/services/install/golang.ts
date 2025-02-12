
import { execCommand } from "../exect-command";
import { removeFiles, updateFiles } from "../update-remove-files";

export const installDependenciesGolang = async (projectDir: string): Promise<void> => {
	try {
		await execCommand(
			"go mod tidy",
			"Wait a moment, installing Go dependencies...",
			projectDir
		);
	} catch (error) {
		throw new Error(
			`Failed to install Go dependencies: ${(error as Error).message}`
		);
	}
};
export const processFilesGolang = async (
	projectDir: string,
	projectName: string
): Promise<void> => {
	try {
		await removeFiles(projectDir);
		await updateFiles(projectDir, projectName);
	} catch (error) {
		throw new Error(
			`Failed to process Go project files: ${(error as Error).message}`
		);
	}
};