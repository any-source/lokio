import { execCommand } from "../exect-command";
import { removeFiles, updateFiles } from "../update-remove-files";


export const installDependenciesDart = async (projectDir: string): Promise<void> => {
    try {
        await execCommand(
            "dart pub get",
            "Wait a moment, installing Dart dependencies...",
            projectDir
        );
    } catch (error) {
        throw new Error(
            `Failed to install Dart dependencies: ${(error as Error).message}`
        );
    }
};
export const processFilesDart = async (
    projectDir: string,
    projectName: string
): Promise<void> => {
    try {
        await removeFiles(projectDir);
        await updateFiles(projectDir, projectName);
    } catch (error) {
        throw new Error(
            `Failed to process Dart project files: ${(error as Error).message}`
        );
    }
};