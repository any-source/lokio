import { stdout } from "node:process";
import { log } from "@/utils/util-use";
import { sleep } from "bun";
import color from "chalk";

export const info = async (prefix: string, text: string) => {
	await sleep(100);
	if (stdout.columns < 80) {
		log(`${color.cyan("◼")}  ${color.cyan(prefix)}`);
		log(`${" ".repeat(9)}${color.dim(text)}`);
	} else {
		log(`${color.cyan("◼")}  ${color.cyan(prefix)} ${color.dim(text)}`);
	}
};
