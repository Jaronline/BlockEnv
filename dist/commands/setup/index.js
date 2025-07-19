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
const { parseLoader, parseEnvName } = require("../../parsers");
const { InvalidArgumentError} = require("commander");
const Option = require("../../lib/Option");

/**
 * @param {import("../../lib").Program} program
 */
module.exports.loadCommands = function(program) {
    program
        .command("setup")
        .description("Setup the testing environment")
        .addOption(new Option("-s, --side <side>", "Whether to setup the server or client").choices(["client", "server"]))
        .addOption(new Option("-e, --environment <environment>", "Which environment to setup").conflicts("side").argParser(parseEnvName.bind(null, program.config())))
		.addOption(new Option("-l, --loader <loader>", "Specify the modloader to use (currently only 'neoforge' is supported)").argParser(parseLoader))
		.addOption(new Option("--loader-version <version>", "Specify the modloader version to use"))
		.addOption(new Option("-m, --minecraft-version <version>", "Specify the Minecraft version to use").deprecate())
		// TODO: remove this flag in version 2.0.0, keep it for now to maintain compatibility with older setups
		.addOption(new Option("--new-setup-order", "Enable the new order of setup, which first runs the installer and then downloads the libraries and assets").conflicts("minecraftVersion").default(false))
		.hook("preAction", (thisCommand) => {
			const { environment, loader, loaderVersion, newSetupOrder, minecraftVersion } = thisCommand.opts();
			if (environment && !environment.loader && !(loader && loaderVersion)) {
				throw new InvalidArgumentError("No loader specified for environment. Please specify a loader and its version.");
			}
			if (!newSetupOrder) {
				console.warn("Warning: The legacy setup order is deprecated and will be removed in v2.0.0. To switch to the new setup process, enable the --new-setup-order option.");
			}
			if (!newSetupOrder && !minecraftVersion) {
				throw new InvalidArgumentError("No Minecraft version specified. Please specify a Minecraft version using the '--minecraft-version' option.");
			}
		})
		.action(async (options) => {
            try {
                await runSetup(options, program.config(), program.downloader);
            } catch (error) {
                program.error(error.message);
            }
        });
}

const envTypeFiles = {
    "client": "./client",
    "server": "./server",
};

async function runSetup(options, config, downloader) {
    const { side, environment } = options;
    if (environment) {
        return require(envTypeFiles[environment.type]).setup(options, config, downloader);
    }
    if (!side || side == "client") {
        await require("./client").setup(options, config, downloader);
    }
    if (!side || side == "server") {
        await require("./server").setup(options, config, downloader);
    }
}
