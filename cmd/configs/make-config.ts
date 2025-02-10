import { Github } from "@/github/readfile";

const fileName = async (type_file: string): Promise<string> => {
	const data = await Github();
	return data.FILENAME_YAML ? data.FILENAME_YAML[type_file.toUpperCase()] : "";
};

const folderStructure = async (type_file: string): Promise<string> => {
	const data = await Github();
	return data.FOLDERNAME_YAML
		? data.FOLDERNAME_YAML[type_file.toUpperCase()]
		: "";
};

const getFileDescription = async (type_file: string): Promise<string> => {
	const data = await Github();
	return data.FILEDESCRIPTION_YAML
		? data.FILEDESCRIPTION_YAML[type_file.toUpperCase()]
		: "";
};

const fileFormat = async (type_file: string): Promise<string> => {
	const data = await Github();
	return data.FILEFORMAT_YAML
		? data.FILEFORMAT_YAML[type_file.toUpperCase()]
		: "";
};

export { fileName, folderStructure, getFileDescription, fileFormat };
