import { removeFiles, updateFiles } from "../update-remove-files";

export const processFilesDart = async (
    projectDir: string,
    projectName: string
): Promise<void> => {
    try {
        await removeFiles(projectDir);
        await updateFiles(projectDir, projectName);
    } catch (error) {
        throw new Error(
            `Failed to process KT project files: ${(error as Error).message}`
        );
    }
};