import MakeFile from "@/command/make-file";
import { CONTEXT_KEY } from "@/configs/context-key";
import { fileFormat, fileName, folderStructure } from "@/configs/make-config";
import { DEFAULT_MAPPINGS } from "@/configs/make-type";
import { getContext } from "@/context/main";
import { TEXT } from "@/environment/text";
import { EjsFolder, useGetLanguage } from "@/hooks/use_get_language";
import { cancel, isCancel, select, text } from "@clack/prompts";
import type { Command } from "commander";

export const ProgramMake = async (program: Command) => {
	program
		.command("make")
		.alias("m")
		.description(TEXT.PROGRAM.MAKE_DESCRIPTION)
		.action(async () => {
			const name = getContext(CONTEXT_KEY.CONFIGS.NAME);
			const outputPath = getContext(CONTEXT_KEY.CONFIGS.DIR) as {
				[key: string]: string;
			} | null;

			const fileTypes = DEFAULT_MAPPINGS[name?.toString() as string] || [];
			const ejs_file = (await select({
				message: "What type of file do you want to create?",
				options: fileTypes,
			})) as string;
			if (isCancel(ejs_file)) {
				cancel(TEXT.PROGRAM.CANCELED);
				process.exit(0);
			}

			const file_name = (await text({
				message: "What is the name of the file?",
			})) as string;
			if (isCancel(file_name)) {
				cancel(TEXT.PROGRAM.CANCELED);
				process.exit(0);
			}

			if (!outputPath) {
				throw new Error("Output path is not defined");
			}
			const lang = useGetLanguage(name as string);
			await MakeFile({
				named: file_name,
				created_at: new Date().toISOString(),
				file_name: fileName(ejs_file),
				file_output_create: outputPath[ejs_file],
				file_folder_structure: folderStructure(ejs_file),
				file_format: fileFormat(ejs_file),

				ejs_file,
				ejs_folder: EjsFolder(lang),
			});
		});
};
