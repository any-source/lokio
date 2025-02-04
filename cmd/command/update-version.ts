import { execSync } from "node:child_process";
import os from "node:os";
import { ENV } from "@/environment/main";
import { log } from "@/utils/util-use";
import axios from "axios";
import chalk from "chalk";

interface PackageManagerInfo {
	name: string;
	windowsDetectCommand?: string;
	unixDetectCommand: string;
	installCommand: (packageName: string) => string;
	versionCheckCommand: (packageName: string) => string;
}

const packageManagers: PackageManagerInfo[] = [
	{
		name: "bun",
		windowsDetectCommand: "where bun",
		unixDetectCommand: "command -v bun",
		installCommand: (pkg) => `bun add -g ${pkg}`,
		versionCheckCommand: (pkg) => `bun pm ls -g ${pkg}`,
	},
	{
		name: "yarn",
		windowsDetectCommand: "where yarn",
		unixDetectCommand: "command -v yarn",
		installCommand: (pkg) => `yarn global add ${pkg}`,
		versionCheckCommand: (pkg) => `yarn global list ${pkg}`,
	},
	{
		name: "pnpm",
		windowsDetectCommand: "where pnpm",
		unixDetectCommand: "command -v pnpm",
		installCommand: (pkg) => `pnpm install -g ${pkg}`,
		versionCheckCommand: (pkg) => `pnpm list -g ${pkg}`,
	},
	{
		name: "npm",
		windowsDetectCommand: "where npm",
		unixDetectCommand: "command -v npm",
		installCommand: (pkg) => `npm install -g ${pkg}`,
		versionCheckCommand: (pkg) => `npm list -g ${pkg}`,
	},
];

function detectPackageManager(): PackageManagerInfo | null {
	const platform = os.platform();
	const detectCommand =
		platform === "win32"
			? (pm: PackageManagerInfo) => pm.windowsDetectCommand
			: (pm: PackageManagerInfo) => pm.unixDetectCommand;

	for (const pm of packageManagers) {
		try {
			const command = detectCommand(pm);
			if (!command) continue;

			execSync(command, {
				stdio: "ignore",
				shell: platform === "win32" ? "cmd" : "/bin/sh",
			});
			return pm;
		} catch {}
	}
	return null;
}

function isPackageInstalledGlobally(pm: PackageManagerInfo): boolean {
	try {
		const platform = os.platform();
		const output = execSync(pm.versionCheckCommand(ENV.NAME), {
			encoding: "utf-8",
			stdio: ["ignore", "pipe", "ignore"],
			shell: platform === "win32" ? "cmd" : "/bin/sh",
		});
		return output.includes(ENV.NAME);
	} catch {
		return false;
	}
}

async function checkAndUpdateVersion(): Promise<boolean> {
	try {
		// Detect the package manager
		const packageManager = detectPackageManager();
		if (!packageManager) {
			log(chalk.red("No supported package manager found"));
			return false;
		}

		// Verify package is installed globally with this package manager
		if (!isPackageInstalledGlobally(packageManager)) {
			log(
				chalk.yellow(
					`${ENV.NAME} not installed globally with ${packageManager.name}`,
				),
			);
			return false;
		}

		log(chalk.dim(`With : ${packageManager.name} on ${os.platform()}`));

		// Fetch the latest version from npm
		const response = await axios.get(
			`https://registry.npmjs.org/${ENV.NAME}/latest`,
		);
		const latestVersion = response.data.version;

		// Compare current version with latest version
		if (latestVersion !== ENV.VERSION) {
			log(chalk.yellow(`New version available: ${latestVersion}`));
			log(chalk.blue(`Updating package using ${packageManager.name}...`));

			// Perform global update using the detected package manager
			const platform = os.platform();
			execSync(packageManager.installCommand(`${ENV.NAME}@latest`), {
				stdio: "inherit",
				shell: platform === "win32" ? "cmd" : "/bin/sh",
			});

			log(
				chalk.green(
					`Successfully updated to version ${latestVersion} with ${packageManager.name}`,
				),
			);
			return true;
		}
		log(chalk.green("You are using the latest version\n"));
		return false;
	} catch (error) {
		log(chalk.red(`Updating package version: ${error}`));
		return false;
	}
}

export default checkAndUpdateVersion;
