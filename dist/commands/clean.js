/**!
BlockEnv: Minecraft Java testing environment for modpacks.
Copyright (C) 2025 Jaronline

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
const { parseEnvName } = require("../parsers");
const { join } = require("node:path");
const { existsSync } = require("node:fs");
const { rmrf, determineInstallPath } = require("../utils");
const { Option } = require("commander");

/**
 * @param {import("../lib").Program} program
 */
module.exports.loadCommands = function(program) {
    program
        .command("clean")
        .description("Clean the testing environment")
        .addOption(new Option("-s, --side <side>", "Whether to clean the server or client").choices(["client", "server"]))
        .addOption(new Option("-e, --environment <environment>", "The environment to clean").conflicts("side").argParser(parseEnvName.bind(null, program.config())))
        .action(async (options) => {
            try {
                await runClean(options, program.config());
            } catch (error) {
                program.error(error.message);
            }
        });
}

const CLIENT_FILES = [
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
];

const SERVER_FILES = [
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
];

async function runClean(options, configData) {
    const { side, environment } = options;
    const { path, config } = configData;
    if (environment) {
        const installDir = determineInstallPath(options, configData);
        const files = environment.type === "client" ? CLIENT_FILES : SERVER_FILES;
        return cleanEnvironment(environment.name, installDir, files);
    }
    if (!side || side == "client")
        await cleanEnvironment("client", join(path, config.baseDir, "client"), CLIENT_FILES);
    if (!side || side == "server")
        await cleanEnvironment("server", join(path, config.baseDir, "server"), SERVER_FILES);
}

async function cleanEnvironment(name, path, files) {
    if (!existsSync(path)) {
        throw new Error(`Environment "${name}" does not exist: ${path}, please run \`blockenv setup\` first.`);
    }

    console.log(`Cleaning up environment "${name}" at ${path}...`);
    await Promise.all(files.map(file => rmrf(join(path, file))));
    console.log(`Environment "${name}" cleaned successfully.`);
}