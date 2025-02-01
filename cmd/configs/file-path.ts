import { join } from "node:path";

class FilePath {
	private readonly projectRoot: string;

	constructor() {
		this.projectRoot = process.cwd();
	}

	create(...segments: string[]): string {
		return join(this.projectRoot, ...segments);
	}

	data(filename: string): string {
		return this.create("data", filename);
	}

	config(filename: string): string {
		return this.create("data", "config", filename);
	}

	ejs_golang(filename: string): string {
		return this.create("data", "ejs.t", "golang", filename);
	}
	ejs_kotlin(filename: string): string {
		return this.create("data", "ejs.t", "kotlin", filename);
	}
	ejs_typescript(filename: string): string {
		return this.create("data", "ejs.t", "typescript", filename);
	}

	custom(directory: string, filename: string): string {
		return this.create(directory, filename);
	}

	getRoot(): string {
		return this.projectRoot;
	}
}

const filePath = new FilePath();
export { filePath, FilePath };
