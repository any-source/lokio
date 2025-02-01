import { join } from "node:path";
import { file } from "bun";

const filePaths = {
	"info.md": join(
		process.env.HOME || "",
		".local",
		"share",
		"lokio",
		"info.md",
	),
};

const EMBEDDED_FILES: { [key: string]: string } = {};

for (const [key, path] of Object.entries(filePaths)) {
	try {
		const bytes = await file(path).arrayBuffer();
		EMBEDDED_FILES[key] = new TextDecoder().decode(bytes);
	} catch (error) {
		console.error(`Gagal membaca file: ${path}`, error);
	}
}

export function getEmbeddedContent(key: keyof typeof EMBEDDED_FILES): string {
	return EMBEDDED_FILES[key];
}

class FilePath {
	private readonly projectRoot: string;

	constructor() {
		this.projectRoot = process.cwd();
	}

	// Original path methods (useful for development)
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

	// New methods to get embedded file contents
	getEmbeddedContent(key: keyof typeof EMBEDDED_FILES): string {
		return EMBEDDED_FILES[key];
	}

	// Helper methods for specific file types
	getDataContent(filename: string): string {
		return this.getEmbeddedContent(filename as keyof typeof EMBEDDED_FILES);
	}

	getConfigContent(filename: string): string {
		return this.getEmbeddedContent(filename as keyof typeof EMBEDDED_FILES);
	}

	getEjsGolangContent(filename: string): string {
		return this.getEmbeddedContent(
			`golang/${filename}` as keyof typeof EMBEDDED_FILES,
		);
	}

	getEjsKotlinContent(filename: string): string {
		return this.getEmbeddedContent(
			`kotlin/${filename}` as keyof typeof EMBEDDED_FILES,
		);
	}

	getEjsTypescriptContent(filename: string): string {
		return this.getEmbeddedContent(
			`typescript/${filename}` as keyof typeof EMBEDDED_FILES,
		);
	}
}

const filePath = new FilePath();
export { filePath, FilePath };

// // Example usage
// if (import.meta.main) {
//     // Access embedded content
//     const infoContent = filePath.getDataContent("info.md");
//     console.log("Info content:", infoContent);

//     const configContent = filePath.getConfigContent("config.json");
//     console.log("Config content:", configContent);

//     const templateContent = filePath.getEjsTypescriptContent("template.ejs");
//     console.log("Template content:", templateContent);
// }
