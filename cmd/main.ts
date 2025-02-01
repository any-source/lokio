import { Command } from "commander";
import { ProgramInit } from "./programs/init";
import { ProgramInfo } from "./programs/info";

export const run = async () => {
    try {        
        const program = new Command();
        await ProgramInit(program);
        await ProgramInfo(program);
        program.parse(process.argv);
    } catch (error) {
        console.error("❌ Gagal membaca file info.md:", error);
    }
};