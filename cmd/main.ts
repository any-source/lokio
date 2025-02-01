import { Command } from "commander";
import { ProgramInit } from "./programs/init";
import { ProgramInfo } from "./programs/info";
import { TEXT } from "./environment/text";
import { log } from './utils/util-use';
import { useReadConfig } from "./hooks/use_config";

export const run = async () => {
    try {
        const program = new Command();
        const { exist, data } = useReadConfig();
        await ProgramInit(program);
        if (!exist) {
            log("tidak ada filenya")
        }
        if (exist) {
            log(`name: ${data.name} ${data.package}`)
        }

        await ProgramInfo(program);
        program.parse(process.argv);
    } catch (error) {
        console.error(`${TEXT.PROGRAM.ERROR_RUN}:`, error);
    }
};