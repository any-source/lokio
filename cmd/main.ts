import { Command } from "commander";
import { CONTEXT_KEY } from "./configs/context-key";
import { FilePath } from "./configs/file-path";
import { clearContext, setContext } from "./context/main";
import { TEXT } from "./environment/text";
import { useReadConfig } from "./hooks/use_config";
import { ProgramCreate } from "./programs/create";
import { ProgramInfo } from "./programs/info";
import { ProgramInit } from "./programs/init";
import { ProgramMake } from "./programs/make";

export const run = async () => {
	try {
		const filePath = new FilePath(__dirname);
		filePath.addDirectory("data");
		filePath.saveAsBinary("output.bin");

		const program = new Command();
		const { exist, data } = useReadConfig();
		await ProgramInit(program);
		if (!exist) {
			clearContext();
			await ProgramCreate(program);
		}
		if (exist) {
			setContext(CONTEXT_KEY.CONFIGS.NAME, data.name);
			setContext(CONTEXT_KEY.CONFIGS.PACKAGE, data.package);
			setContext(CONTEXT_KEY.CONFIGS.DIR, data.dir);
			await ProgramMake(program);
		}

		await ProgramInfo(program);
		program.parse(process.argv);
	} catch (error) {
		console.error(`${TEXT.PROGRAM.ERROR_RUN}:`, error);
	}
};
