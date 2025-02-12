import { exec } from "node:child_process";
import chalk from "chalk";
import ora from "ora";

const createSpinner = (message: string) => {
	return ora({
		text: chalk.dim(message),
		spinner: "dots",
	});
};

export const execCommand = async (
	command: string,
	spinnerMessage: string,
	projectDir: string,
): Promise<void> => {
	return new Promise((resolve, reject) => {
		const spinner = createSpinner(spinnerMessage);
		spinner.start();

		const process = exec(command, { cwd: projectDir });

		process.stdout?.on("data", (data) => {
			spinner.text = `${spinnerMessage} ${chalk.dim(data.toString().trim())}`;
		});

		process.stderr?.on("data", (data) => {
			spinner.text = `${spinnerMessage} ${chalk.yellow(data.toString().trim())}`;
		});

		process.on("close", (code) => {
			if (code === 0) {
				spinner.stop();
				resolve();
			} else {
				spinner.fail(chalk.red("dependency installation failed"));
				reject(new Error(`Installation failed with code ${code}`));
			}
		});
	});
};
