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
const { join } = require("node:path");
const { mkdir, mkdtemp } = require("node:fs/promises");
const { curl, spawnAsync, rmrf } = require("../../utils");
const { tmpdir: getTempDir } = require("node:os");

module.exports.downloadInstaller = async function({ loaderVersion }) {
    const tmpDir = await mkdtemp(join(getTempDir(), "blockenv-"));

    console.log("Downloading installer...");
    await curl(`https://maven.neoforged.net/releases/net/neoforged/neoforge/${loaderVersion}/neoforge-${loaderVersion}-installer.jar`, {
        failOnError: true,
        location: true,
        ip: "ipv4",
        retry: 3,
        output: join(tmpDir, "installer.jar")
    });

    return tmpDir;
}

function validateArgs(args) {
    if (typeof args !== 'object' || !args || Array.isArray(args)) {
        throw new Error("Invalid arguments: must be an object");
    }
    if (args.installServer && typeof args.installServer !== "string" && typeof args.installServer !== "boolean") {
        throw new Error("Invalid argument: installServer must be a string or boolean");
    }
    if (args.installClient && typeof args.installClient !== "string" && typeof args.installClient !== "boolean") {
        throw new Error("Invalid argument: installClient must be a string or boolean");
    }
    if (args.serverJar && typeof args.serverJar !== "boolean") {
        throw new Error("Invalid argument: serverJar must be a boolean");
    }
}

function parseArgs(args) {
    const parsed = [];
    if (args.installServer) {
        parsed.push("--installServer");
    }
    if (typeof args.installServer === "string") {
        parsed.push(args.installServer);
    }
    if (args.installClient) {
        parsed.push("--installClient");
    }
    if (typeof args.installClient === "string") {
        parsed.push(args.installClient);
    }
    if (args.serverJar) {
        parsed.push("--server-jar");
    }
    return parsed;
}

module.exports.runInstaller = async function({ installDir, tmpDir }, args) {
    validateArgs(args);
    args = parseArgs(args);
    
    console.log("Running installer...");
    await mkdir(installDir, { recursive: true });
    await spawnAsync("java", [
        "-jar",
        join(tmpDir, "installer.jar"),
        ...args,
    ]);
}

module.exports.cleanInstaller = async function(tmpDir) {
    await rmrf(tmpDir);
    await rmrf(join(process.cwd(), "installer.jar.log"));
}