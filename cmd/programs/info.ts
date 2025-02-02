import { ENV } from "@/environment/main";
import { Github } from "@/github/readfile";
import { say } from "@/interfaces/say";
import { log } from "@/utils/util-use";
import chalk from "chalk";
import type { Command } from "commander";

export const ProgramInfo = async (program: Command) => {
	program
		.command("info")
		.alias("i")
		.description(`Show information about the ${ENV.NAME}`)
		.action(async () => {
			const data = await Github();
			await say(
				[
					["Welcome", "to", ENV.VERSION],
					`Let's show information about the ${ENV.NAME}!`,
				] as string[],
				{ clear: false, hat: "", tie: "" },
			);
			log(`${data.GITHUB_MARKDOWN_INFO}\n`);
			log(`Author : ${chalk.green(ENV.AUTHOR)}`);
		});
};
