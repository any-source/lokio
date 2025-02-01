import { join } from "node:path";
import { file } from "bun";

export const filePaths = {
	"info.md": join(
		process.env.HOME || "",
		".local",
		"share",
		"lokio",
		"info.md",
	),
	"astro-frontend.yaml": join(
		process.env.HOME || "",
		".local",
		"share",
		"lokio",
		"astro-frontend.yaml",
	),
	"go-backend.yaml": join(
		process.env.HOME || "",
		".local",
		"share",
		"lokio",
		"go-backend.yaml",
	),
	"hono-backend.yaml": join(
		process.env.HOME || "",
		".local",
		"share",
		"lokio",
		"hono-backend.yaml",
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
