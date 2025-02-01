import { Command } from "commander";
import { ProgramInit } from "./programs/init";
import { ProgramInfo } from "./programs/info";
import { TEXT } from "./environment/text";

export const run = async () => {
    try {        
        const program = new Command();
        await ProgramInit(program);
        await ProgramInfo(program);
        program.parse(process.argv);
    } catch (error) {
        console.error(`${TEXT.PROGRAM.ERROR_RUN}:`, error);
    }
};