import { FilePath } from "@/configs/file-path";

const buildBinary = () => {
	try {
		console.log("Creating data binary...");
		const filePath = new FilePath(__dirname);
		filePath.addDirectory("data");
		filePath.saveAsBinary("public/bin/data.bin");
	} catch (error) {
		console.error("Failed to create data binary:", error);
		process.exit(1);
	}
};

buildBinary();
