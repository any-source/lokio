import fs from "node:fs/promises";
import path from "node:path";
import { CONTEXT_KEY } from "@/configs/context-key";
import { getContext } from "@/context/main";
import { readFileFromGithub } from "@/hooks/use_github";
import YAML from "yaml";

interface Pattern {
	regex: string;
	replace: string;
}

interface FileConfig {
	patterns: Pattern[];
}

interface FolderRename {
	from: string;
	to: string;
}

interface Config {
	files_remove?: string[];
	files_replace_package?: Record<string, FileConfig>;
	folder_rename?: FolderRename[];
}

const getPackageConfig = async (): Promise<Config> => {
	const PKG_NAME = getContext(CONTEXT_KEY.COMMAND.BOILERPLATE);
	if (PKG_NAME === null) {
		throw new Error("PKG_NAME is null");
	}
	const pkgNameValue =
		typeof PKG_NAME === "object" && "value" in PKG_NAME
			? PKG_NAME.value
			: PKG_NAME;
	const file = await readFileFromGithub(`package/${pkgNameValue}.yaml`);
	return YAML.parse(file);
};

const validatePattern = (pattern: unknown): pattern is Pattern => {
	if (!pattern || typeof pattern !== "object") {
		return false;
	}

	const { regex, replace } = pattern as Pattern;
	if (typeof regex !== "string" || typeof replace !== "string") {
		return false;
	}

	return true;
};

export const renameFolders = async (
	projectDir: string,
	projectName: string,
): Promise<void> => {
	try {
		const config = await getPackageConfig();
		const folderRenames = config?.folder_rename;

		if (!Array.isArray(folderRenames)) {
			return;
		}

		for (const rename of folderRenames) {
			if (!(rename.from?.trim() && rename.to?.trim())) {
				throw new Error(
					'Invalid folder rename configuration: missing "from" or "to" path',
				);
			}

			const fromPath = path.resolve(projectDir, rename.from);
			const toPath = path.resolve(
				projectDir,
				rename.to.replace(/\${name}/g, projectName),
			);

			try {
				// Check if source folder exists
				await fs.access(fromPath);

				// Create parent directory of destination if it doesn't exist
				await fs.mkdir(path.dirname(toPath), { recursive: true });

				// Perform the rename
				await fs.rename(fromPath, toPath);
				// log(`Successfully renamed folder: ${rename.from} -> ${rename.to}`);
			} catch (error) {
				if ((error as NodeJS.ErrnoException).code === "ENOENT") {
					console.warn(`Source folder not found: ${fromPath}`);
				} else {
					throw new Error(
						`Failed to rename folder ${rename.from}: ${(error as Error).message}`,
					);
				}
			}
		}
	} catch (error) {
		console.error("Error in renameFolders:", error);
		throw error;
	}
};

export const updateFiles = async (
	projectDir: string,
	projectName: string,
): Promise<void> => {
	try {
		const config = await getPackageConfig();
		const filesReplacePackage = config?.files_replace_package;

		if (!filesReplacePackage || typeof filesReplacePackage !== "object") {
			throw new Error("Invalid or missing files_replace_package in YAML");
		}

		const updatePromises = Object.entries(filesReplacePackage).map(
			async ([filePath, fileConfig]) => {
				// More detailed validation
				if (!fileConfig || typeof fileConfig !== "object") {
					throw new Error(
						`Invalid file configuration for ${filePath}: configuration is null or not an object`,
					);
				}

				if (!Array.isArray(fileConfig.patterns)) {
					throw new Error(
						`Invalid file configuration for ${filePath}: patterns is not an array`,
					);
				}

				const fullPath = path.resolve(projectDir, filePath);

				try {
					const exists = await fs
						.access(fullPath)
						.then(() => true)
						.catch(() => false);

					if (!exists) {
						console.warn(`File not found: ${fullPath}`);
						return;
					}

					let content = await fs.readFile(fullPath, "utf-8");

					for (const pattern of fileConfig.patterns) {
						if (!validatePattern(pattern)) {
							console.error("Invalid pattern:", pattern);
							throw new Error(
								"Invalid pattern configuration: regex or replace is missing or invalid",
							);
						}

						try {
							const compiledRegex = new RegExp(pattern.regex, "g");
							const replacedString = pattern.replace.replace(
								/\${name}/g,
								projectName,
							);
							content = content.replace(compiledRegex, replacedString);
						} catch (_regexError) {
							throw new Error(`Invalid regex pattern: ${pattern.regex}`);
						}
					}

					await fs.writeFile(fullPath, content, "utf-8");
					// log(`Successfully updated: ${filePath}`);
				} catch (error) {
					throw new Error(
						`Failed to update ${filePath}: ${(error as Error).message}`,
					);
				}
			},
		);

		await Promise.all(updatePromises);
	} catch (error) {
		console.error("Error details:", error);
		throw error;
	}
};

export const removeFiles = async (projectDir: string): Promise<void> => {
	const config = await getPackageConfig();
	const results = config?.files_remove;

	if (!(results && Array.isArray(results))) {
		return;
	}

	const removePromises = results.map(async (file: string) => {
		const filePath = path.resolve(projectDir, file);
		try {
			await fs.rm(filePath, { recursive: true, force: true });
			// log(`Successfully removed: ${file}`);
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
				throw error;
			}
		}
	});

	await Promise.all(removePromises);
};
