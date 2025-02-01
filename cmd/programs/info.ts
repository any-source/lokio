import { CONTEXT_KEY } from "@/configs/context-key";
import { filePath } from "@/configs/file-path";
import { getContext } from "@/context/main";
import { ENV } from "@/environment/main";
import { say } from "@/interfaces/say";
import { log } from "@/utils/util-use";
import chalk from "chalk";
import type { Command } from "commander";

export const ProgramInfo = async (program: Command) => {
	const infoContent = filePath.getDataContent("info.md");
	program
		.command("info")
		.alias("i")
		.description(`Show information about the ${ENV.NAME}`)
		.action(async () => {
			await say(
				[
					["Welcome", "to", ENV.VERSION],
					`Let's show information about the ${ENV.NAME}!`,
				] as string[],
				{ clear: false, hat: "", tie: "" },
			);
			log(`${infoContent}\n`);
			log(`Author : ${chalk.green(ENV.AUTHOR)}`);
		});
};
