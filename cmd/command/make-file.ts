import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import ejs from "ejs";

import { CONTEXT_KEY } from "@/configs/context-key";
import { getContext } from "@/context/main";
import { readFileFromGithub } from "@/hooks/use_github";
import { log } from "@/utils/util-use";
import { fileFormat, fileName, folderStructure } from "@/configs/make-config";

interface MakeFileProps {
	file_output_create: string | Array<{ [key: string]: string }>;
	named: string;
	created_at: string;
	file_name: string;
	file_folder_structure: string;
	file_format: string;
	ejs_file: string;
	ejs_folder: string;
	is_query?: boolean;
}

/**
 * Enhanced MakeFile function that supports both single and multiple file generation
 */
const MakeFile = async ({
	file_output_create,
	named,
	created_at,
	file_name,
	file_folder_structure,
	file_format,
	ejs_file,
	ejs_folder,
	is_query,
}: MakeFileProps) => {
	try {
		// 1. Get template content
		const template = await readFileFromGithub(
			`ejs.t/${ejs_folder}/${ejs_file}.ejs.t`,
		);

		// 2. Prepare template variables
		const packageName = getContext(CONTEXT_KEY.CONFIGS.PACKAGE);
		const templateVars = {
			name: named.toLowerCase(),
			Name: named.charAt(0).toUpperCase() + named.slice(1).toLowerCase(),
			NAME: named.toUpperCase(),
			created_at,
			file_name,
			file_folder_structure,
			file_format,
			package: packageName,
			isQuery: is_query,
		};

		// 3. Render template
		const renderedContent = ejs.render(template, templateVars);

		// 4. Handle file creation based on input type
		if (Array.isArray(file_output_create)) {
			const createdFiles = await Promise.all(
				file_output_create.map(async (config) => {
					const [key, outputPath] = Object.entries(config)[0];
					const file_name = await fileName(key);					
					return createSingleFile({
						outputPath,
						named,
						file_folder_structure: await folderStructure(key),
						file_name,
						file_format: await fileFormat(key),
						renderedContent,
					});
				})
			);

			return createdFiles;
		}
		// Handle single file creation
		return createSingleFile({
			outputPath: file_output_create,
			named,
			file_folder_structure,
			file_name,
			file_format,
			renderedContent,
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		log(`Error creating file(s): ${errorMessage}`);
		throw error;
	}
};

interface CreateSingleFileProps {
	outputPath: string;
	named: string;
	file_folder_structure: string;
	file_name: string;
	file_format: string;
	renderedContent: string;
}

/**
 * Helper function to create a single file
 */
const createSingleFile = async ({
	outputPath,
	named,
	file_folder_structure,
	file_name,
	file_format,
	renderedContent,
}: CreateSingleFileProps): Promise<string> => {
	// 1. Resolve folder structure
	const resolvedfileFolderStructure = replacePlaceholders(
		file_folder_structure,
		named,
	);
	const fullOutputPath = path.join(
		outputPath,
		resolvedfileFolderStructure,
	);

	// 2. Create directory
	fs.mkdirSync(fullOutputPath, { recursive: true });

	// 3. Resolve and create file
	const resolvedfile_name =
		replacePlaceholders(file_name, named) + file_format;
	const finalFilePath = path.join(fullOutputPath, resolvedfile_name);

	// 4. Write file
	fs.writeFileSync(finalFilePath, renderedContent, "utf-8");

	log(`File successfully created at: ${chalk.green(finalFilePath)}\n`);
	return finalFilePath;
};

/**
 * Helper function to replace name placeholders in strings
 */
const replacePlaceholders = (str: string, name: string): string => {
	return str
		.replace(/{name}/g, name.toLowerCase())
		.replace(
			/{Name}/g,
			name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
		)
		.replace(/{NAME}/g, name.toUpperCase());
};

export default MakeFile;