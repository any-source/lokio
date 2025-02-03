import { updatePackageVersion } from "./update-version";

async function run() {
	// Increment minor version (1.0.0 -> 1.1.0)
	await updatePackageVersion({ type: "minor" });
}
run();
