import color from "chalk";

export const label = (
	text: string,
	c = color.bgHex("#f58b3b"),
	t = color.black,
) => c(` ${t(text)} `);
