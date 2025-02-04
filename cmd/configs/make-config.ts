import { FILE_TYPES } from "./make-type";

const fileName = (type_file: string): string => {
	switch (type_file) {
		case FILE_TYPES.HOOK:
			return "use_{name}";
		case FILE_TYPES.SHARED:
			return "main";
		case FILE_TYPES.CALL:
			return "call_{name}";
		case FILE_TYPES.COMPONENT:
			return "{name}";
		case FILE_TYPES.SCREEN:
			return "main";
		case FILE_TYPES.LAYOUT:
			return "{name}_layout";
		case FILE_TYPES.CONTROLLER:
			return "{name}_controller";
		case FILE_TYPES.MIDDLEWARE:
			return "{name}_middleware";
		case FILE_TYPES.SERVICE:
			return "{name}_service";
		case FILE_TYPES.SCHEMA:
			return "{name}_schema";
		case FILE_TYPES.GO_CONTROLLER:
			return "{name}_controller";
		case FILE_TYPES.KT_FEATURE:
			return "{name}_schema";
		default:
			return "main";
	}
};

const folderStructure = (type_file: string): string => {
	switch (type_file) {
		case FILE_TYPES.HOOK:
			return "";
		case FILE_TYPES.SHARED:
			return "";
		case FILE_TYPES.CALL:
			return "";
		case FILE_TYPES.COMPONENT:
			return "";
		case FILE_TYPES.SCREEN:
			return "screen_{name}";
		case FILE_TYPES.LAYOUT:
			return "";
		case FILE_TYPES.CONTROLLER:
			return "";
		case FILE_TYPES.MIDDLEWARE:
			return "";
		case FILE_TYPES.SERVICE:
			return "";
		case FILE_TYPES.SCHEMA:
			return "";
		case FILE_TYPES.GO_CONTROLLER:
			return "";
		case FILE_TYPES.KT_FEATURE:
			return "";
		default:
			return "";
	}
};

const getFileDescription = (type_file: string): string => {
	switch (type_file) {
		case FILE_TYPES.HOOK:
			return "Hook is a custom function that can be used in your project to encapsulate reusable logic.";
		case FILE_TYPES.SHARED:
			return "Shared files contain utilities, constants, or other shared resources that can be used across the project.";
		case FILE_TYPES.CALL:
			return "Call files are used to handle API calls or other external service interactions.";
		case FILE_TYPES.COMPONENT:
			return "Component files represent reusable UI components in your project.";
		case FILE_TYPES.SCREEN:
			return "Screen files define the main views or pages of your application.";
		case FILE_TYPES.LAYOUT:
			return "Layout files define the structure and arrangement of components across multiple pages or screens.";
		case FILE_TYPES.CONTROLLER:
			return "Controller files handle the business logic and act as an intermediary between the view and the model.";
		case FILE_TYPES.MIDDLEWARE:
			return "Middleware files are used to intercept and process requests before they reach the main logic.";
		case FILE_TYPES.SERVICE:
			return "Service files encapsulate business logic or external service interactions, often used for API calls or data processing.";
		case FILE_TYPES.SCHEMA:
			return "Schema files define the structure and validation rules for data in your application.";
		case FILE_TYPES.GO_CONTROLLER:
			return "Controller files handle the business logic and act as an intermediary between the view and the model.";
		case FILE_TYPES.KT_FEATURE:
			return "Screen files define the main views or pages of your application.";
		default:
			return "No description available for this file type.";
	}
};

const fileFormat = (type_file: string): string => {
	switch (type_file) {
		case FILE_TYPES.HOOK:
			return ".ts";
		case FILE_TYPES.SHARED:
			return ".ts";
		case FILE_TYPES.CALL:
			return ".ts";
		case FILE_TYPES.COMPONENT:
			return ".tsx";
		case FILE_TYPES.SCREEN:
			return ".tsx";
		case FILE_TYPES.LAYOUT:
			return ".tsx";
		case FILE_TYPES.CONTROLLER:
			return ".ts";
		case FILE_TYPES.MIDDLEWARE:
			return ".ts";
		case FILE_TYPES.SERVICE:
			return ".ts";
		case FILE_TYPES.SCHEMA:
			return ".ts";
		case FILE_TYPES.GO_CONTROLLER:
			return ".go";
		case FILE_TYPES.KT_FEATURE:
			return ".kt";
		default:
			return "";
	}
};

export { fileName, folderStructure, getFileDescription, fileFormat };
