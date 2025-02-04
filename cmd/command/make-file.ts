import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import ejs from "ejs";

import { CONTEXT_KEY } from "@/configs/context-key";
import { getContext } from "@/context/main";
import { readFileFromGithub } from "@/hooks/use_github";
import { log } from "@/utils/util-use";

interface MakeFileProps {
	file_output_create: string;
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
 * Enhanced MakeFile function that supports both local and GitHub-hosted templates
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
		// 1. Get template content (either from local or GitHub)
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

		// 4. Resolve folder structure
		const resolvedfileFolderStructure = replacePlaceholders(
			file_folder_structure,
			named,
		);
		const fullOutputPath = path.join(
			file_output_create,
			resolvedfileFolderStructure,
		);

		// 5. Create directory
		fs.mkdirSync(fullOutputPath, { recursive: true });

		// 6. Resolve and create file
		const resolvedfile_name =
			replacePlaceholders(file_name, named) + file_format;
		const finalFilePath = path.join(fullOutputPath, resolvedfile_name);

		// 7. Write file
		fs.writeFileSync(finalFilePath, renderedContent, "utf-8");

		log(`File successfully created at: ${chalk.green(finalFilePath)}\n`);
		return finalFilePath;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		log(`Error creating file: ${errorMessage}`);
		throw error;
	}
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
