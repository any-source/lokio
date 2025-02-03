import { ENV } from "@/environment/main";
import { TEXT } from "@/environment/text";
import { Github } from "@/github/readfile";
import { say } from "@/interfaces/say";
import { log } from "@/utils/util-use";
import chalk from "chalk";
import type { Command } from "commander";

export const ProgramInfo = async (program: Command) => {
	program
		.command("info")
		.alias("i")
		.description(TEXT.PROGRAM.INFORMATION)
		.action(async () => {
			const data = await Github();
			await say(
				[TEXT.PROGRAM.SAY.INFO.STEP1, TEXT.PROGRAM.SAY.INFO.STEP2] as string[],
				{ clear: false, hat: "", tie: "" },
			);
			log(`${data.GITHUB_MARKDOWN_INFO}\n`);
			log(`Author : ${chalk.green(ENV.AUTHOR)}`);
		});
};
