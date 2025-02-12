import fs from "node:fs";
import path from "node:path";
import { ENV } from "@/environment/main";
import YAML from "yaml";

type ConfigDir = {
	hook?: string;
	shared?: string;
	call?: string;
	component?: string;
	screen?: string;
	layout?: string;
	feature?: string;
	controller?: string;
	middleware?: string;
	service?: string;
	schema?: string;
};

type ConfigData = {
	name: string | null;
	package: string | null;
	dir: ConfigDir;
};

type UseReadConfigType = {
	exist: boolean;
	data: ConfigData;
};

/**
 * @example
 * const { exist, data } = useReadConfig();
 * if (exist) {
 * 		console.log(data);
 * }
 */
export const useReadConfig = (): UseReadConfigType => {
	const filePath = path.join(process.cwd(), ENV.CONFIG_FILE_NAME);
	if (!fs.existsSync(filePath)) {
		return {
			exist: false,
			data: {
				name: null,
				package: null,
				dir: {},
			},
		};
	}
	const fileContent = fs.readFileSync(filePath, "utf8");
	const parsedYaml = YAML.parse(fileContent);
	return {
		exist: true,
		data: {
			name: parsedYaml.name || null,
			package: parsedYaml.package || null,
			dir: Object.fromEntries(
				Object.entries(parsedYaml.dir || {}).map(([key, value]) => [
					key,
					value || null,
				]),
			),
		},
	};
};

/**
 * @param config
 * @param key
 * @param value
 * @example
 * if (config.exist) {
 * 		addDirectory(config.data, "utils", "src/utils");
 * }
 */
export const addDirectory = (
	config: ConfigData,
	key: string,
	value: string,
): ConfigData => {
	return {
		...config,
		dir: {
			...config.dir,
			[key]: value,
		},
	};
};

/**
 * @param config
 * @param key
 * @example
 * if (config.exist) {
 * 		removeDirectory(config.data, "hook");
 * }
 */

export const removeDirectory = (
	config: ConfigData,
	key: string,
): ConfigData => {
	const updatedDir = { ...config.dir };
	delete updatedDir[key as keyof ConfigDir];
	return {
		...config,
		dir: updatedDir,
	};
};
