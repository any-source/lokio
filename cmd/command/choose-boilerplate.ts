import {
	BOILERPLATE_OPTIONS,
	type BOILERPLATE_OPTIONS_TYPE,
} from "@/configs/boilerplate";
import { TEXT } from "@/environment/text";
import { info } from "@/interfaces/info";
import { label } from "@/interfaces/label";
import { warn } from "@/interfaces/warn";
import { log } from "@/utils/util-use";
import { cancel, isCancel, select } from "@clack/prompts";
import color from "chalk";

export const CommandChooseBoilerplate =
	async (): Promise<BOILERPLATE_OPTIONS_TYPE> => {
		const selectedTemplate = await SelectBoilerplate(BOILERPLATE_OPTIONS);
		if (!selectedTemplate) {
			cancel(TEXT.PROGRAM.CANCELED);
			process.exit(0);
		}
		if (!selectedTemplate.status) {
			await warn(
				"Sorry!",
				"Template is not ready yet. Please try again later.",
			);
			log("\n");
			process.exit(0);
		}

		await info(
			"Yey!",
			`You selected ${color.green(selectedTemplate.label)} for your new project.`,
		);
		return selectedTemplate;
	};
const SelectBoilerplate = async (
	options: BOILERPLATE_OPTIONS_TYPE[],
	message = "Pick your tech!",
): Promise<BOILERPLATE_OPTIONS_TYPE | undefined> => {
	const options_boilerplate = (await select({
		message: `${label("type")} ${message}`,
		options: options,
		maxItems: 2,
	})) as string;

	if (isCancel(options_boilerplate)) {
		return undefined;
	}

	const selected = options.find((item) => item.value === options_boilerplate);

	if (selected?.children) {
		return await SelectBoilerplate(
			selected.children,
			`What specific type of ${selected.label}?`,
		);
	}

	return selected;
};
