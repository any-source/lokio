import { TEXT } from "@/environment/text";
import { log } from "@/utils/util-use";
import type { Command } from "commander";
export const ProgramUpdate = async (program: Command) => {
	program
		.command("update")
		.alias("u")
		.description(TEXT.PROGRAM.UPDATE_VERSION)
		.action(async () => {
			log(TEXT.PROGRAM.UPDATE_VERSION_SUCCESS);
		});
};
