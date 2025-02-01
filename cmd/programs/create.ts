import { TEXT } from "@/environment/text";
import { log } from "@/utils/util-use";
import type { Command } from "commander";

export const ProgramCreate = async (program: Command) => {
    program
        .command("create")
        .alias("c")
        .description(TEXT.PROGRAM.CREATE_DESCRIPTION)
        .action(async () => {
            log("create")
        });
}