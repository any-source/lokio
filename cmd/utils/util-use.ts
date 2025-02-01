import { platform } from "node:os";
const unicode = { enabled: platform() !== "win32" };
export const useAscii = () => !unicode.enabled;
export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
export const randomBetween = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1) + min);
export const random = (...arr: unknown[]) => {
	const flattenedArr = arr.flat(1);
	return flattenedArr[Math.floor(flattenedArr.length * Math.random())];
};
export const strip = (str: string) => {
	const pattern = [
		"[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
		"(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))",
	].join("|");

	const RGX = new RegExp(pattern, "g");
	return typeof str === "string" ? str.replace(RGX, "") : str;
};

const stdout = process.stdout;
export const log = (message: string) => stdout.write(`${message}\n`);

export const align = (
	text: string,
	dir: "start" | "end" | "center",
	len: number,
) => {
	const pad = Math.max(len - strip(text).length, 0);
	switch (dir) {
		case "start":
			return text + " ".repeat(pad);
		case "end":
			return " ".repeat(pad) + text;
		case "center":
			return (
				" ".repeat(Math.floor(pad / 2)) + text + " ".repeat(Math.floor(pad / 2))
			);
		default:
			return text;
	}
};

export const NormalizeName = (name: string) => {
	if (!name) return "";
	const words = name.split("-");
	const normalizedWords = words.map((word) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	});
	return normalizedWords.join(" ");
};
