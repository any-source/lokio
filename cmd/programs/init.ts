import { ENV } from "@/environment/main";
import { TEXT } from "@/environment/text";
import { useReadConfig } from "@/hooks/use_config";
import { Help } from "@/interfaces/help";
import { say } from "@/interfaces/say";
import chalk from "chalk";
import type { Command } from "commander";
import { BoilerplateShowLabel } from "./../configs/boilerplate";

export const ProgramInit = async (program: Command, exist = false) => {
	program
		.name(ENV.NAME)
		.version(ENV.VERSION, "-v, --version", TEXT.PROGRAM.VERSION_DESCRIPTION)
		.action(async () => {
			const x = useReadConfig();
			await say(
				[
					[
						TEXT.PROGRAM.SAY.INIT.STEP1,
						BoilerplateShowLabel(x.data.name as string),
					],
					TEXT.PROGRAM.SAY.INIT.STEP2,
				] as string[],
				{
					clear: false,
					hat: "",
					tie: "",
				},
			);

			const existConfig: [string, string][] = [
				["create", TEXT.PROGRAM.HELP.CREATE],
			];
			const notExistConfig: [string, string][] = [
				["make", TEXT.PROGRAM.HELP.MAKE],
				["generate", TEXT.PROGRAM.HELP.GENERATE],
			];
			Help({
				commandName: ENV.NAME,
				usage: `usage: ${chalk.green(ENV.NAME)} <command>`,
				tables: {
					Commands: [
						...(exist ? notExistConfig : []),
						...(!exist ? existConfig : []),
						["info", TEXT.PROGRAM.HELP.INFO],
						["--version", TEXT.PROGRAM.HELP.VERSION],
					],
				},
				description: chalk.dim(TEXT.PROGRAM.DESCRIPTION),
			});
		});
};
