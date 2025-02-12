
import { execCommand } from "../exect-command";
import { removeFiles, updateFiles } from "../update-remove-files";

export const installDependenciesRust = async (projectDir: string): Promise<void> => {
	try {
		await execCommand(
			"cargo build",
			"Wait a moment, installing Rust dependencies...",
			projectDir
		);
	} catch (error) {
		throw new Error(
			`Failed to install Rust dependencies: ${(error as Error).message}`
		);
	}
};
export const processFilesRust = async (
	projectDir: string,
	projectName: string
): Promise<void> => {
	try {
		await removeFiles(projectDir);
		await updateFiles(projectDir, projectName);
	} catch (error) {
		throw new Error(
			`Failed to process Rust project files: ${(error as Error).message}`
		);
	}
};