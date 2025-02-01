import { stdout } from "node:process";
import { log } from "@/utils/util-use";
import { sleep } from "bun";
import color from "chalk";

export const warn = async (prefix: string, text: string) => {
	await sleep(100);
	if (stdout.columns < 80) {
		log(`${color.red("◼")}  ${color.red(prefix)}`);
		log(`${" ".repeat(9)}${color.dim(text)}`);
	} else {
		log(`${color.red("◼")}  ${color.red(prefix)} ${color.dim(text)}`);
	}
};
