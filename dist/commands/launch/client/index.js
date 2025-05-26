const { join } = require("node:path");
const { getConfig } = require("../../../config");
const { detectOS, detectArch, spawnAsync } = require("../../../utils");
const { getProfileVersion } = require("./profile");
const { getMergedVersionJSON } = require("./version");
const { getClasspath } = require("./classpath");
const { subsitutePlaceholders } = require("./placeholder");

function getClasspathSeperator(osName) {
    if (osName === "windows") {
        return ";";
    }
    return ":";
}

module.exports.launchClient = async function(cliVersion, options) {
    const { profile } = options;
    const { path, config } = getConfig();
    const envDir = join(path, config.baseDir);
    const installDir = join(envDir, "client");
    const versionsDir = join(installDir, "versions");
    const libDir = join(installDir, "libraries");
    const assetsDir = join(installDir, "assets");
    const osName = detectOS();
    const arch = detectArch();
    const classpathSeparator = getClasspathSeperator(osName);

    const version = getProfileVersion({ installDir, profileName: profile });
    const versionJSON = getMergedVersionJSON({ versionsDir, version, osName, arch });
    const classpath = getClasspath({ versionJSON, libDir, separator: classpathSeparator });
    const { mainClass, assets: assetIndex } = versionJSON;

    const subsitute = (str) => subsitutePlaceholders(str, {
        version: cliVersion, classpath, loaderVersion: version, libDir, classpathSeparator,
        assetsDir, assetIndex, versionType: versionJSON.type, gameDir: installDir
    });
    const jvmArgs = versionJSON.arguments.jvm.map(arg => subsitute(arg));
    const gameArgs = versionJSON.arguments.game.map(arg => subsitute(arg));

    await spawnAsync("java", [
        ...jvmArgs,
        mainClass,
        ...gameArgs
    ], { cwd: installDir });
}