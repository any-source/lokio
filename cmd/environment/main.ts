import pkg from "../../package.json" assert { type: "json" };

export const ENV = {
    NAME: "lokio",
    VERSION: pkg.version,
    AUTHOR: pkg.author.name,
    TAGLINE: "Structuring Code, One Command at a Time",
    CONFIG_FILE_NAME: ".lokio.yaml"
}