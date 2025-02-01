import readline from "node:readline";
import { createLogUpdate } from "log-update";
import { action } from "@/utils/util-action";
import { random, randomBetween, sleep, strip, useAscii } from "@/utils/util-use";
import color from "chalk";

type Message = string | Promise<string>;
export const say = async (
	msg: Message | Message[] = [],
	{
		clear = false,
		hat = "",
		tie = "",
		stdin = process.stdin,
		stdout = process.stdout,
	} = {},
) => {
	const messages = Array.isArray(msg) ? msg : [msg];
	const rl = readline.createInterface({ input: stdin, escapeCodeTimeout: 50 });
	const logUpdate = createLogUpdate(stdout, { showCursor: false });
	readline.emitKeypressEvents(stdin, rl);
	let i = 0;
	let cancelled = false;
	const done = async () => {
		stdin.off("keypress", done);
		if (stdin.isTTY) stdin.setRawMode(false);
		rl.close();
		cancelled = true;
		if (i < messages.length - 1) {
			logUpdate.clear();
		} else if (clear) {
			logUpdate.clear();
		} else {
			logUpdate.done();
		}
	};

	if (stdin.isTTY) stdin.setRawMode(true);
	stdin.on("keypress", (_, key) => {
		if (stdin.isTTY) stdin.setRawMode(true);
		const k = action(key, true);
		if (k === "abort") {
			done();
			return process.exit(0);
		}
		if (["up", "down", "left", "right"].includes(k as string)) return;
		done();
	});

	const eyes = useAscii()
		? ["•", "•", "o", "o", "•", "O", "^", "•"]
		: ["●", "●", "●", "●", "●", "○", "○", "•"];
	const mouths = useAscii()
		? ["•", "O", "*", "o", "o", "•", "-"]
		: ["•", "○", "■", "▪", "▫", "▬", "▭", "-", "○"];
	const walls = useAscii() ? ["—", "|"] : ["─", "│"];
	const corners = useAscii() ? ["+", "+", "+", "+"] : ["╭", "╮", "╰", "╯"];

	const face = (msg: string, { mouth = mouths[0], eye = eyes[0] } = {}) => {
		const [h, v] = walls;
		const [tl, tr, bl, br] = corners;
		const head = h.repeat(3 - strip(hat).split("").length);
		const bottom = h.repeat(3 - strip(tie).split("").length);
		return [
			`${tl}${h.repeat(2)}${hat}${head}${tr}  ${color.bold(color.cyan("Assistant:"))}`,
			`${v} ${eye} ${color.cyanBright(mouth)} ${eye}  ${msg}`,
			`${bl}${h.repeat(2)}${tie}${bottom}${br}`,
		].join("\n");
	};

	for (let message of messages) {
		message = await message;
		const _message = Array.isArray(message) ? message : message.split(" ");
		const msg: string[] = [];
		let eye = random(eyes);
		let j = 0;
		for (const word of [""].concat(_message)) {
			word;
			if (word) msg.push(word);
			const mouth = random(mouths) as string;
			if (j % 7 === 0) eye = random(eyes) as string;
			if (i === 1) eye = random(eyes) as string;
			logUpdate(
				`\n${face(msg.join(" "), { mouth: mouth as string, eye: eye as string })}`,
			);
			logUpdate(
				`\n${face(msg.join(" "), { mouth: mouth as string, eye: eye as string })}`,
			);
			if (!cancelled) await sleep(randomBetween(75, 200));
			j++;
		}
		if (!cancelled) await sleep(100);
		const tmp = await Promise.all(_message).then((res) => res.join(" "));
		const text = `\n${face(tmp, { mouth: useAscii() ? "u" : "◡", eye: useAscii() ? "^" : "◠" })}`;
		logUpdate(text);
		if (!cancelled) await sleep(randomBetween(1200, 1400));
		i++;
	}
	stdin.off("keypress", done);
	await sleep(100);
	done();
	if (stdin.isTTY) stdin.setRawMode(false);
	stdin.removeAllListeners("keypress");
};