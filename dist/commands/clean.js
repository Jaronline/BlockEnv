const { Command } = require("commander");
const { parseSide } = require("../options/side");
const { getConfig } = require("../config");
const { join } = require("node:path");
const { existsSync } = require("node:fs");
const { rmrf } = require("../utils");

/**
 * @param {Command} program
 */
module.exports.loadCommands = function(program) {
    program
        .command("clean")
        .description("Clean the testing environment")
        .option("-s, --side <side>", "Whether to clean the server or client", parseSide)
        .action(async (options) => {
            try {
                await runClean(options);
            } catch (error) {
                program.error(error.message);
            }
        });
}

async function runClean(options) {
    const { side } = options;
    const { path, config } = getConfig();
    if (!side || side == "client")
        await cleanEnvironment("client", join(path, config.baseDir, "client"), [
            join("config", "*"),
            join("defaultconfigs", "*"),
            join("downloads", "*"),
            join("logs", "*"),
            join("mods", "*"),
            join("resourcepacks", "*"),
            join("shaderpacks", "*"),
            "options.txt",
            "servers.dat",
            "servers.dat_old",
            "usercache.json",
            "usernamecache.json",
        ], options);
    if (!side || side == "server")
        await cleanEnvironment("server", join(path, config.baseDir, "server"), [
            join("config", "*"),
            join("defaultconfigs", "*"),
            join("logs", "*"),
            join("mods", "*"),
            "world",
            "usercache.json",
            "usernamecache.json",
            "whitelist.json",
            "ops.json",
            "banned-ips.json",
            "banned-players.json",
        ], options);
}

async function cleanEnvironment(name, path, files, options) {
    if (!existsSync(path)) {
        throw new Error(`Environment "${name}" does not exist: ${path}, please run \`blockenv setup\` first.`);
    }

    console.log(`Cleaning up environment "${name}" at ${path}...`);
    await Promise.all(files.map(file => rmrf(join(path, file))));
    console.log(`Environment "${name}" cleaned successfully.`);
}