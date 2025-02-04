import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import ejs from "ejs";

import { CONTEXT_KEY } from "@/configs/context-key";
import { getContext } from "@/context/main";
import { readFileFromGithub } from "@/hooks/use_github";
import { log } from "@/utils/util-use";

interface MakeFileProps {
	output_file_created: string;
	name: string;
	created_at: string;
	fileName: string;
	folderStructure: string;
	lang: string;
	fileFormat: string;
	ejs_file: string;
}

/**
 * Enhanced MakeFile function that supports both local and GitHub-hosted templates
 */
const MakeFile = async ({
	output_file_created,
	name,
	created_at,
	fileName,
	folderStructure,
	lang,
	fileFormat,
	ejs_file,
}: MakeFileProps) => {
	try {
		// 1. Get template content (either from local or GitHub)
		const template = await readFileFromGithub(
			`ejs.t/${lang}/${ejs_file}.ejs.t`,
		);
		// 2. Prepare template variables
		const packageName = getContext(CONTEXT_KEY.CONFIGS.PACKAGE);
		const templateVars = {
			name: name.toLowerCase(),
			Name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
			NAME: name.toUpperCase(),
			created_at,
			fileName,
			folderStructure,
			fileFormat,
			package: packageName,
		};

		// 3. Render template
		const renderedContent = ejs.render(template, templateVars);

		// 4. Resolve folder structure
		const resolvedFolderStructure = replacePlaceholders(folderStructure, name);
		const fullOutputPath = path.join(
			output_file_created,
			resolvedFolderStructure,
		);

		// 5. Create directory
		fs.mkdirSync(fullOutputPath, { recursive: true });

		// 6. Resolve and create file
		const resolvedFileName = replacePlaceholders(fileName, name) + fileFormat;
		const finalFilePath = path.join(fullOutputPath, resolvedFileName);

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
