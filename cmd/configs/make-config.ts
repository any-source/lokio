import { Github } from "@/github/readfile";

const fileName = async (type_file: string): Promise<string> => {
	try {
		const data = await Github();
		const MAKE_CONFIG = data.MAKECONFIG_YAML?.MAKE_CONFIG
		const configKey = type_file.toUpperCase();
		if (!MAKE_CONFIG) {
			throw new Error('MAKE_CONFIG is undefined');
		}
		const config = MAKE_CONFIG[configKey as keyof typeof MAKE_CONFIG] || MAKE_CONFIG?.DEFAULT as unknown as { file_name: string };
		if (typeof config === 'object' && 'file_name' in config) {
			return config.file_name;
		}
		throw new Error('Invalid config format');
	} catch (error) {
		console.error('Error getting file name:', error);
		return '';
	}
};


const folderStructure = async (type_file: string): Promise<string> => {
	try {
		const data = await Github();
		const MAKE_CONFIG = data.MAKECONFIG_YAML?.MAKE_CONFIG
		const configKey = type_file.toUpperCase();
		if (!MAKE_CONFIG) {
			throw new Error('MAKE_CONFIG is undefined');
		}
		const config = MAKE_CONFIG[configKey as keyof typeof MAKE_CONFIG] || MAKE_CONFIG?.DEFAULT as unknown as { folder_name: string };
		if (typeof config === 'object' && 'folder_name' in config) {
			return config.folder_name;
		}
		throw new Error('Invalid config format');
	} catch (error) {
		console.error('Error getting file name:', error);
		return '';
	}
};

const getFileDescription = async (type_file: string): Promise<string> => {
	try {
		const data = await Github();
		const MAKE_CONFIG = data.MAKECONFIG_YAML?.MAKE_CONFIG
		const configKey = type_file.toUpperCase();
		if (!MAKE_CONFIG) {
			throw new Error('MAKE_CONFIG is undefined');
		}
		const config = MAKE_CONFIG[configKey as keyof typeof MAKE_CONFIG] || MAKE_CONFIG?.DEFAULT as unknown as { description: string };
		if (typeof config === 'object' && 'description' in config) {
			return config.description;
		}
		throw new Error('Invalid config format');
	} catch (error) {
		console.error('Error getting file name:', error);
		return '';
	}
};

const fileFormat = async (type_file: string): Promise<string> => {
	try {
		const data = await Github();
		const MAKE_CONFIG = data.MAKECONFIG_YAML?.MAKE_CONFIG
		const configKey = type_file.toUpperCase();
		if (!MAKE_CONFIG) {
			throw new Error('MAKE_CONFIG is undefined');
		}
		const config = MAKE_CONFIG[configKey as keyof typeof MAKE_CONFIG] || MAKE_CONFIG?.DEFAULT as unknown as { extension: string };
		if (typeof config === 'object' && 'extension' in config) {
			return config.extension;
		}
		throw new Error('Invalid config format');
	} catch (error) {
		console.error('Error getting file name:', error);
		return '';
	}
};

export { fileName, folderStructure, getFileDescription, fileFormat };
