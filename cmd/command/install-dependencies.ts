import { CONTEXT_KEY } from "@/configs/context-key";
import { setContext } from "@/context/main";
import { TEXT } from "@/environment/text";
import { info } from "@/interfaces/info";
import { cancel, confirm, isCancel } from "@clack/prompts";

export const CommandInstallDependencies = async (): Promise<boolean> => {
	const result = (await confirm({
		message: "Install dependencies?",
		active: "yes",
		inactive: "no",
		initialValue: true,
	})) as boolean;

	if (isCancel(result)) {
		cancel(TEXT.PROGRAM.CANCELED);
		process.exit(0);
	}

	if (!result) {
		await info("No problem!", "Remember to install dependencies after setup.");
	}

	setContext<boolean>(CONTEXT_KEY.COMMAND.INSTALL_DEPENDENCY, result);
	return result;
};
