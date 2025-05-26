const { dirname, join, parse } = require("node:path");
const { existsSync } = require("node:fs");

function hasConfigInPath(path) {
    return existsSync(join(path, "blockenv.config.json"));
}

function getConfigInPath(path) {
    if (!hasConfigInPath(path)) {
        return null;
    }
    return join(path, "blockenv.config.json");
}

function nearestConfig({ from = process.cwd() } = {}) {
    const { root } = parse(from);
    let currentPath = from;
    while (!hasConfigInPath(currentPath) && currentPath !== root) {
        currentPath = dirname(currentPath);
    }
    return getConfigInPath(currentPath);
}

module.exports.getConfig = function() {
    const configFile = nearestConfig();
    if (!configFile) {
        throw new Error("No configuration file found. Please ensure you have a blockenv configuration in your project directory or any parent directory.");
    }
    const parsedFile = parse(configFile);
    return {
        path: parsedFile.dir,
        file: parsedFile.base,
        ext: parsedFile.ext,
        name: parsedFile.name,
        config: require(configFile),
    };
}