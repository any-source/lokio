export const TEXT = {
	PROGRAM: {
		SAY: {
			INIT: {
				STEP1: "Lokio Assistant",
				STEP2: "We will assist in the development process",
			},
			INFO: {
				STEP1: "Hi, I'm Lokio Assistant",
				STEP2: "I will be showing you information",
			},
		},
		DESCRIPTION: "make the development process faster and more structured",
		ERROR_RUN: "Error running command",
		VERSION_DESCRIPTION: "Output the current version",
		MAKE_DESCRIPTION: "Create a pattern file for project",
		CREATE_DESCRIPTION: "Create a new project",
		CANCELED: "Operation cancelled.",
		INFORMATION: "Information",
		UPDATE_VERSION: "Update to the latest version",
		UPDATE_VERSION_SUCCESS: "Update to the latest version success",
		HELP: {
			CREATE: "(c) Create a new project",
			MAKE: "(m) Create a pattern file for project",
			GENERATE: "(g) Generate Files that have been created by the community",
			INFO: "(i) Show information about the project",
			VERSION: "(-v) Check the current version",
		},
	},
	CLONE_PROJECT: {
		START_SETUP: "🚀 Starting template setup...",
		DIR_CLEAN_FAILED: "Warning: Failed to clean directory",
		CONFIG_COPY_SUCCESS: "✓ Configuration file copied successfully",
		CONFIG_NOT_FOUND: "⚠️ Configuration file not found",
		CONFIG_COPY_FAILED: "Failed to copy configuration",
		TEMPLATE_COPIED: "✓ Template files copied",
		SUCCESS: (projectName: string) =>
			`\n🎉 Success! Project ${projectName} is ready!`,
		FAILURE: "\n❌ Template creation failed:",
	},
};
