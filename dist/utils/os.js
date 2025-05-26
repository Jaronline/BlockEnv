const { machine, platform } = require("node:os");

module.exports.usingWindows = function() {
    return platform() === "win32";
}

module.exports.detectOS = function() {
    switch (platform()) {
        case "linux":
            return "linux";
        case "darwin":
            return "osx";
        case "win32":
            return "windows";
        default:
            throw new Error(`Unsupported platform: ${platform()}`);
    }
}

module.exports.detectArch = function() {
    switch (machine()) {
        case "x86_64":
            return "x86_64";
        case "i386":
        case "i686":
            return "x86";
        case "arm64":
        case "aarch64":
            return "arm64";
        case "arm":
            return "arm32";
        default:
            throw new Error(`Unsupported architecture: ${machine()}`);
    }
}