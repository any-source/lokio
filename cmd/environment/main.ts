import pkg from "../../package.json" assert { type: "json" };

export const ENV = {
	NAME: "lokio",
	AUTHOR: pkg.author.name,
	TAGLINE: "Structuring Code, One Command at a Time",
	CONFIG_FILE_NAME: ".lokio.yaml",
	LOKIO_REGISTRY: "https://registry.npmjs.org/lokio-assistant/latest",
	GUTHUB: {
		LOKIO_TEMPLATE: "https://github.com/any-source/examples",
		LOKIO_GITHUB_URL:
			"https://raw.githubusercontent.com/any-source/examples/main",
	},
};
