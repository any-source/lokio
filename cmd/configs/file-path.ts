import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

class BinaryBundler {
	private readonly assetMap: Map<string, Buffer>;
	private readonly basePath: string;

	constructor(basePath: string) {
		this.assetMap = new Map();
		this.basePath = basePath;
	}

	addFile(relativePath: string): void {
		const fullPath = resolve(this.basePath, relativePath);
		try {
			const content = readFileSync(fullPath);
			// Store only the relative path in the map
			const normalizedPath = relativePath.replace(/\\/g, "/");
			this.assetMap.set(normalizedPath, content);
		} catch (error) {
			console.error(`Failed to read file: ${relativePath}`, error);
		}
	}

	addDirectory(dirPath: string): void {
		const fs = require("node:fs");
		const path = require("node:path");

		const readDirRecursive = (dir: string) => {
			const entries = fs.readdirSync(dir, { withFileTypes: true });

			for (const entry of entries) {
				const fullPath = path.join(dir, entry.name);
				// Calculate path relative to the base path, not cwd
				const relativePath = path.relative(this.basePath, fullPath);

				if (entry.isDirectory()) {
					readDirRecursive(fullPath);
				} else {
					this.addFile(relativePath);
				}
			}
		};

		const fullDirPath = resolve(this.basePath, dirPath);
		readDirRecursive(fullDirPath);
	}

	generateBinary(): Buffer {
		const manifest = Array.from(this.assetMap.keys());
		const manifestBuffer = Buffer.from(JSON.stringify(manifest));

		let totalSize = 4 + manifestBuffer.length;
		for (const [_, content] of this.assetMap) {
			totalSize += 4 + content.length;
		}

		const result = Buffer.alloc(totalSize);
		let offset = 0;

		result.writeUInt32LE(manifestBuffer.length, offset);
		offset += 4;
		manifestBuffer.copy(result, offset);
		offset += manifestBuffer.length;

		for (const [_, content] of this.assetMap) {
			result.writeUInt32LE(content.length, offset);
			offset += 4;
			content.copy(result, offset);
			offset += content.length;
		}

		return result;
	}

	saveBinary(outputPath: string): void {
		const binary = this.generateBinary();
		writeFileSync(outputPath, binary);
	}
}

class FilePath {
	private readonly basePath: string;
	private readonly bundler: BinaryBundler;

	constructor(basePath?: string) {
		// If no base path provided, use directory where the script is located
		this.basePath = basePath || dirname(require.main?.filename || "");
		this.bundler = new BinaryBundler(this.basePath);
	}

	create(...segments: string[]): string {
		return join(...segments);
	}

	data(filename: string): string {
		const path = this.create("data", filename);
		this.bundler.addFile(path);
		return path;
	}

	config(filename: string): string {
		const path = this.create("data", "config", filename);
		this.bundler.addFile(path);
		return path;
	}

	ejs_golang(filename: string): string {
		const path = this.create("data", "ejs.t", "golang", filename);
		this.bundler.addFile(path);
		return path;
	}

	ejs_kotlin(filename: string): string {
		const path = this.create("data", "ejs.t", "kotlin", filename);
		this.bundler.addFile(path);
		return path;
	}

	ejs_typescript(filename: string): string {
		const path = this.create("data", "ejs.t", "typescript", filename);
		this.bundler.addFile(path);
		return path;
	}

	custom(directory: string, filename: string): string {
		const path = this.create(directory, filename);
		this.bundler.addFile(path);
		return path;
	}

	getRoot(): string {
		return this.basePath;
	}

	saveAsBinary(outputPath: string): void {
		this.bundler.saveBinary(outputPath);
	}

	addDirectory(dirPath: string): void {
		this.bundler.addDirectory(dirPath);
	}
}

// Create with explicit base path for CLI usage
const filePath = new FilePath(__dirname);
export { filePath, FilePath, BinaryBundler };
