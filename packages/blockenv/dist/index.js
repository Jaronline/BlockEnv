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
const { Program, getConfig, createAllCurlStrategy } = require("./lib");
const { version } = require("../package.json");
const Option = require("./lib/Option");

function checkForDeprecatedOptions(command) {
	const optionKeys = Object.keys(command.opts());
	if (optionKeys.length !== 0) {
		command.options
			.filter((option) => option instanceof Option && option.deprecated)
			.filter((option) => optionKeys.includes(option.attributeName()))
			.forEach((option) => console.warn(
				`Warning: Option '${option.long}' is deprecated and will be removed in a future version.`
			));
	}
}

module.exports = function createProgram() {
	const program = new Program("blockenv")
		.description("a Minecraft modpack testing environment CLI")
		.version(version);

	try {
		program
			.config(getConfig())
			.allDownloadStrategy(createAllCurlStrategy())
			.hook("preAction", (thisCommand, actionCommand) => {
				checkForDeprecatedOptions(thisCommand);
				checkForDeprecatedOptions(actionCommand);
			});

		require("./commands/clean").loadCommands(program);
		require("./commands/setup").loadCommands(program);
		require("./commands/launch").loadCommands(program);
	} catch (e) {
		program.error(e instanceof Error ? e.message : e);
	}

	return program;
}
