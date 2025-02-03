import fs from "node:fs";
import path from "node:path";
import { log } from "@/utils/util-use";
import color from "chalk";

type VersionType = "major" | "minor" | "patch";

interface VersionUpdateOptions {
	type?: VersionType;
	projectDir?: string;
}

function incrementVersion(
	currentVersion: string,
	type: VersionType = "patch",
): string {
	const [major, minor, patch] = currentVersion
		.replace(/[^\d.]/g, "")
		.split(".")
		.map(Number);

	switch (type) {
		case "major":
			return `${major + 1}.0.0`;
		case "minor":
			return `${major}.${minor + 1}.0`;
		default:
			return `${major}.${minor}.${patch + 1}`;
	}
}

async function updatePackageVersion({
	type = "patch",
	projectDir = process.cwd(),
}: VersionUpdateOptions = {}): Promise<void> {
	const packagePath = path.join(projectDir, "package.json");

	try {
		// Check if package.json exists
		if (!fs.existsSync(packagePath)) {
			throw new Error("package.json not found");
		}

		// Read and parse package.json
		const content = await fs.promises.readFile(packagePath, "utf-8");
		const pkg = JSON.parse(content);
		const indent = /(^\s+)/m.exec(content)?.[1] ?? "\t";

		// Get current version
		const currentVersion = pkg.version;
		if (!currentVersion) {
			throw new Error("No version field found in package.json");
		}

		// Increment version
		const newVersion = incrementVersion(currentVersion, type);
		pkg.version = newVersion;

		// Write updated package.json
		await fs.promises.writeFile(
			packagePath,
			JSON.stringify(pkg, null, indent),
			"utf-8",
		);

		log(color.green(`✓ Version updated: ${currentVersion} → ${newVersion}`));
	} catch (error) {
		console.error(color.red("\n❌ Version update failed:"));
		console.error(color.red((error as Error).message));
		throw error;
	}
}

export { updatePackageVersion, incrementVersion };
