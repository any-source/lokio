import { Command } from "commander";
import { ProgramInit } from "./programs/init";
import { ProgramInfo } from "./programs/info";
import { TEXT } from "./environment/text";
import { useReadConfig } from "./hooks/use_config";
import { ProgramMake } from "./programs/make";
import { ProgramCreate } from "./programs/create";

export const run = async () => {
    try {
        const program = new Command();
        const { exist, data } = useReadConfig();
        await ProgramInit(program);
        if (!exist) {
            await ProgramCreate(program)
        }
        if (exist) {
            await ProgramMake(program)
        }

        await ProgramInfo(program);
        program.parse(process.argv);
    } catch (error) {
        console.error(`${TEXT.PROGRAM.ERROR_RUN}:`, error);
    }
};