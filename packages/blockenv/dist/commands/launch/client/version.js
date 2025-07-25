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
const { existsSync } = require("node:fs");
const { ruleFilter, uniqueFilter: createUniqueFilter, pipelineFilter } = require("../../../filters");

function getVersionJSON({ versionsDir, version }) {
    const path = join(versionsDir, version, `${version}.json`);
    if (!existsSync(path)) {
        throw new Error(`Version JSON for ${version} not found at ${path}`);
    }
    return require(path);
}

function mergeArgumentType(args, parentArgs, { osName, arch }) {
    function unfilteredArgs() {
        if (!parentArgs || parentArgs.length === 0) {
            return args;
        }

        if (!args || args.length === 0) {
            return parentArgs;
        }

        return [...parentArgs, ...args];
    }

    return unfilteredArgs()
        .filter(arg => ruleFilter(arg.rules, { osName, arch }))
        .map(arg => typeof arg === "string" ? arg : arg.value)
        .flat();
}

function mergeArguments(args, parentArgs, { osName, arch }) {
    if (!parentArgs) {
        return args;
    }

    return {
        game: mergeArgumentType(args.game, parentArgs.game, { osName, arch }),
        jvm: mergeArgumentType(args.jvm, parentArgs.jvm, { osName, arch }),
    };
}

function mergeLibraries(libraries, parentLibraries, { osName, arch }) {
    if (!parentLibraries || parentLibraries.length === 0) {
        return libraries;
    }

    if (!libraries || libraries.length === 0) {
        return parentLibraries;
    }

    const uniqueFilter = createUniqueFilter();
    return pipelineFilter(
        lib => ruleFilter(lib.rules, { osName, arch }),
        lib => uniqueFilter(lib.name)
    )(...libraries, ...parentLibraries);
}

function getMergedVersionJSON({ versionsDir, version, osName, arch }) {
    const versionJSON = getVersionJSON({ versionsDir, version });

    if (!versionJSON.inheritsFrom) {
        return versionJSON;
    }

    const parentVersionJSON = getMergedVersionJSON({
        versionsDir,
        version: versionJSON.inheritsFrom,
        osName,
        arch
    });

    return {
        id: versionJSON.id,
        time: versionJSON.time,
        releaseTime: versionJSON.releaseTime,
        type: versionJSON.type,
        mainClass: versionJSON.mainClass,
        assetIndex: versionJSON.assetIndex || parentVersionJSON.assetIndex,
        assets: versionJSON.assets || parentVersionJSON.assets,
        arguments: mergeArguments(
            versionJSON.arguments,
            parentVersionJSON.arguments,
            { osName, arch }
        ),
        libraries: mergeLibraries(
            versionJSON.libraries,
            parentVersionJSON.libraries,
            { osName, arch }
        ),
    };
}

module.exports.getMergedVersionJSON = getMergedVersionJSON;