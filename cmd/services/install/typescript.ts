
import { select } from "@clack/prompts";
import { execCommand } from "../exect-command";
import { removeFiles, updateFiles } from "../update-remove-files";

export const installDependenciesTypescript = async (projectDir: string): Promise<void> => {
	try {
		const command = await select({
			message: "Select package manager",
			initialValue: "bun install",
			options: [
				{
					label: "bun",
					value: "bun install"
				},
				{
					label: "yarn",
					value: "yarn install"
				},
				{
					label: "npm",
					value: "npm install"
				},
				{
					label: "pnpm",
					value: "pnpm install"
				},
			]
		}) as string;
		await execCommand(
			command,
			`Wait a moment, installing dependencies... ${command}`,
			projectDir
		);
	} catch (error) {
		throw new Error(
			`Failed to install Ts dependencies: ${(error as Error).message}`
		);
	}
};
export const processFilesTypescript = async (
	projectDir: string,
	projectName: string
): Promise<void> => {
	try {
		await removeFiles(projectDir);
		await updateFiles(projectDir, projectName);
	} catch (error) {
		throw new Error(
			`Failed to process Ts project files: ${(error as Error).message}`
		);
	}
};