import { filePath } from "@/configs/file-path";
import { ENV } from "@/environment/main";
import { say } from "@/interfaces/say";
import { log } from "@/utils/util-use";
import chalk from "chalk";
import type { Command } from "commander";

export const ProgramInfo = async (program: Command) => {
    const DATA_FiLE_MD = filePath.data("info.md");
    program
        .command("info")
        .alias("i")
        .description(`Show information about the ${ENV.NAME}`)
        .action(async () => {
            const file = Bun.file(DATA_FiLE_MD);
            const content = await file.text();
            await say(
                [
                    [
                        "Welcome",
                        "to",
                        ENV.VERSION,
                    ],
                    `Let's show information about the ${ENV.NAME}!`,
                ] as string[],
                { clear: false, hat: "", tie: "" },
            );
            log(`${content}\n`);
            log(`Author : ${chalk.green(ENV.AUTHOR)}`);
        });
}