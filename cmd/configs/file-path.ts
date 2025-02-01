import { join } from "node:path";
import { file } from "bun";

const getFilePath = (fileName: string) =>
	join(process.env.HOME || "", ".local", "share", "lokio", fileName);

export const filePaths = {
	"info.md": getFilePath("info.md"),
	"astro-frontend.yaml": getFilePath("astro-frontend.yaml"),
	"go-backend.yaml": getFilePath("go-backend.yaml"),
	"hono-backend.yaml": getFilePath("hono-backend.yaml"),
	"kt-mobile-compose-mvvm.yaml": getFilePath("kt-mobile-compose-mvvm.yaml"),
	"next-frontend.yaml": getFilePath("next-frontend.yaml"),
	"next-monolith.yaml": getFilePath("next-monolith.yaml"),
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
