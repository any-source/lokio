// import MakeFile from "@/command/make-file";
import { CONTEXT_KEY } from "@/configs/context-key";
import { DEFAULT_MAPPINGS } from "@/configs/make-type";
import { getContext } from "@/context/main";
import { TEXT } from "@/environment/text";
import { log } from "@/utils/util-use";
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
			const type_file = (await select({
				message: "What type of file do you want to create?",
				options: fileTypes,
			})) as string;
			if (isCancel(type_file)) {
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
			// await MakeFile({
			// 	output_file_created: outputPath[type_file],
			// 	name: file_name,
			// 	lang: "typescript",
			// 	created_at: new Date().toISOString(),
			// 	fileName: fileName(type_file),
			// 	folderStructure: folderStructure(type_file),
			// 	fileFormat: fileFormat(type_file),
			// 	ejs_file: "call",
			// });
			log(JSON.stringify(fileTypes));
			log(JSON.stringify(outputPath));
			// log(JSON.stringify(type_file));
			log(JSON.stringify(name));
		});
};
