import MakeFile from "@/command/make-file";
import { CONTEXT_KEY } from "@/configs/context-key";
import { fileFormat, fileName, folderStructure } from "@/configs/make-config";
import { DEFAULT_MAPPINGS, FILE_TYPES } from "@/configs/make-type";
import { getContext } from "@/context/main";
import { TEXT } from "@/environment/text";
import { useGetEjst } from "@/hooks/use_ejst";
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
			const ejst = await useGetEjst(name as string);
			try {
				if (ejs_file === FILE_TYPES.CALL) {
					const is_call = (await select({
						message: "What type call of file do you want to create?",
						options: [
							{ value: true, label: "Query" },
							{ value: false, label: "Mutation" },
						],
					})) as boolean;
					if (isCancel(is_call)) {
						cancel(TEXT.PROGRAM.CANCELED);
						process.exit(0);
					}
					await MakeFile({
						named: file_name,
						created_at: new Date().toISOString(),
						file_name: fileName(ejs_file),
						file_output_create: outputPath[ejs_file],
						file_folder_structure: folderStructure(ejs_file),
						file_format: fileFormat(ejs_file),
						ejs_file,
						ejs_folder: ejst,
						is_query: is_call,
					});

					if (!is_call) {
						await MakeFile({
							named: file_name,
							created_at: new Date().toISOString(),
							file_name: fileName("schema"),
							file_output_create: outputPath.schema,
							file_folder_structure: folderStructure("schema"),
							file_format: fileFormat("schema"),
							ejs_file: "schema",
							ejs_folder: ejst,
							is_query: is_call,
						});
					}
					return;
				}
				await MakeFile({
					named: file_name,
					created_at: new Date().toISOString(),
					file_name: fileName(ejs_file),
					file_output_create: outputPath[ejs_file],
					file_folder_structure: folderStructure(ejs_file),
					file_format: fileFormat(ejs_file),

					ejs_file,
					ejs_folder: ejst,
				});
			} catch (error) {
				log(JSON.stringify(error));
			}
		});
};
