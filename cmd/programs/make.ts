import { CONTEXT_KEY } from "@/configs/context-key";
import { FILE_TYPES_MAP_DIR } from "@/configs/make-type";
import { getContext } from "@/context/main";
import { TEXT } from "@/environment/text";
import { log } from "@/utils/util-use";
import { cancel, isCancel, select } from "@clack/prompts";
import type { Command } from "commander";

export const ProgramMake = async (program: Command) => {
	program
		.command("make")
		.alias("m")
		.description(TEXT.PROGRAM.MAKE_DESCRIPTION)
		.action(async () => {
			const name = getContext(CONTEXT_KEY.COMMAND.PACKAGE_NAME);
			const fileTypes = FILE_TYPES_MAP_DIR[name?.toString() as string];
			const type_file = (await select({
				message: "What type of file do you want to create?",
				options: fileTypes,
			})) as string;

			if (isCancel(type_file)) {
				cancel(TEXT.PROGRAM.CANCELED);
				process.exit(0);
			}
			log("make");
		});
};
