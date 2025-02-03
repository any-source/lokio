import { updatePackageVersion } from "./update-version";

async function run() {
	// Increment major version (1.0.0 -> 2.0.0)
	await updatePackageVersion({ type: "major" });
}

run();
