import { stdout } from "node:process";
import { ENV } from "@/environment/main";
import { log } from "@/utils/util-use";
import color from "chalk";
import { title } from "./title";

export function Help({
	commandName,
	usage,
	tables,
	description,
}: {
	commandName: string;
	usage?: string;
	tables?: Record<string, [command: string, help: string][]>;
	description?: string;
}) {
	const linebreak = () => "";
	const table = (
		rows: [string, string][],
		{ padding }: { padding: number },
	) => {
		const split = stdout.columns < 60;
		let raw = "";

		for (const row of rows) {
			if (split) {
				raw += `    ${row[0]}\n    `;
			} else {
				raw += `${`${row[0]}`.padStart(padding)}`;
			}
			raw += `  ${color.dim(row[1])}\n`;
		}

		return raw.slice(0, -1); // remove latest \n
	};

	const message: string[] = [];
	message.push(linebreak(), `${title(commandName)} ${color.dim(ENV.TAGLINE)}`);

	if (usage) {
		message.push(linebreak(), `${color.bold(usage)}`);
	}

	if (tables) {
		function calculateTablePadding(rows: [string, string][]) {
			return rows.reduce((val, [first]) => Math.max(val, first.length), 0);
		}
		const tableEntries = Object.entries(tables);
		const padding = Math.max(
			...tableEntries.map(([, rows]) => calculateTablePadding(rows)),
		);
		for (const [, tableRows] of tableEntries) {
			message.push(linebreak(), table(tableRows, { padding }));
		}
	}

	if (description) {
		message.push(linebreak(), `${description}`);
	}

	log(`${message.join("\n")}\n`);
}
