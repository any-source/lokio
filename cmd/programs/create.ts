import { CommandChooseBoilerplate } from "@/command/choose-boilerplate";
import { CommandProjectName } from "@/command/project-name";
import { CONTEXT_KEY } from "@/configs/context-key";
import { getContext } from "@/context/main";
import { TEXT } from "@/environment/text";
import { log } from "@/utils/util-use";
import type { Command } from "commander";

export const ProgramCreate = async (program: Command) => {
	program
		.command("create")
		.alias("c")
		.description(TEXT.PROGRAM.CREATE_DESCRIPTION)
		.action(async () => {
			const pkg_name = await CommandProjectName();
			const tmp = await CommandChooseBoilerplate();
			console.log("Direct project name:", pkg_name);
			console.log("Direct project name:", JSON.stringify(tmp));
		});
};
