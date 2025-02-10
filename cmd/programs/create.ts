import { CommandChooseBoilerplate } from "@/command/choose-boilerplate";
import { CommandInstallDependencies } from "@/command/install-dependencies";
import { CommandProjectName } from "@/command/project-name";
import { TEXT } from "@/environment/text";
import copyTemplate, {
	type SupportedLanguage,
} from "@/hooks/use_clone_boilerplate";
import type { Command } from "commander";

export const ProgramCreate = async (program: Command) => {
	program
		.command("create")
		.alias("c")
		.description(TEXT.PROGRAM.CREATE_DESCRIPTION)
		.action(async () => {
			const pkg_name = await CommandProjectName();
			const tmp = await CommandChooseBoilerplate();
			const dep = await CommandInstallDependencies();
			const ejst = tmp.ejst as SupportedLanguage;
			await copyTemplate({
				install: dep,
				projectName: pkg_name,
				tmpl: tmp.value,
				ejst,
			});
		});
};
