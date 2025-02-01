import { CONTEXT_KEY } from "@/configs/context-key";
import { setContext } from "@/context/main";
import { TEXT } from "@/environment/text";
import { info } from "@/interfaces/info";
import { label } from "@/interfaces/label";
import { cancel, isCancel, text } from "@clack/prompts";
import color from "chalk";

export const CommandProjectName = async (): Promise<string> => {
	const name = (await text({
		placeholder:
			"e.g., myproject (lowercase letters, no spaces, max 30 chars, no numbers at the start)",
		message: `${label("dir")} Where should we create your new project?`,
		validate(value) {
			if (/\s/.test(value)) {
				return "Project name cannot contain spaces";
			}

			if (!value) {
				return "Project name is required";
			}
			if (!/^[a-z][a-z0-9]*$/.test(value)) {
				return "Project name must start with a lowercase letter and can only contain lowercase letters and numbers (no numbers at the start)";
			}

			if (value.length > 30) {
				return "Project name cannot exceed 30 characters";
			}
			return undefined;
		},
	})) as string;
	if (isCancel(name)) {
		cancel(TEXT.PROGRAM.CANCELED);
		process.exit(0);
	}
	await info("Thanks!", `The project will be created in ${color.green(name)}`);

	setContext<string>(CONTEXT_KEY.COMMAND.PACKAGE_NAME, name);
	return name;
};
