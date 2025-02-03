import { updatePackageVersion } from "./update-version";

async function run() {
	// Increment patch version (1.0.0 -> 1.0.1)
	await updatePackageVersion({ type: "patch" });
}
run();
