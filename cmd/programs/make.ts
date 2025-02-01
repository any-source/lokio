import { TEXT } from "@/environment/text";
import { log } from "@/utils/util-use";
import type { Command } from "commander";

export const ProgramMake = async (program: Command) => {
	program
		.command("make")
		.alias("m")
		.description(TEXT.PROGRAM.MAKE_DESCRIPTION)
		.action(async () => {
			log("make");
		});
};
