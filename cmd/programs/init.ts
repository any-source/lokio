import { ENV } from "@/environment/main";
import { TEXT } from "@/environment/text";
import { say } from "@/interfaces/say";
import type { Command } from "commander";

export const ProgramInit = async (program: Command) => {
    program
        .name(ENV.NAME)
        .version(ENV.VERSION, "-v, --version", TEXT.PROGRAM.VERSION_DESCRIPTION)
        .action(async () => {
            await say(["test", "Let's start!"] as string[], {
                clear: false,
                hat: "",
                tie: "",
            });
        });
}