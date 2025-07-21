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
module.exports.ModLoader = class ModLoader {
	#data;

	constructor(data) {
		this.#data = data;
		this.#validateData();
	}

	get name() {
		return this.#data.name;
	}

	get version() {
		return this.#data.version;
	}

	#validateData(data = this.#data) {
		if (!data || typeof data !== "object" || Array.isArray(data)) {
			throw new Error("ModLoader data must be an object.");
		}
		if (!data.name || typeof data.name !== "string") {
			throw new Error("ModLoader name must be a string.");
		}
		if (!data.version || typeof data.version !== "string") {
			throw new Error("ModLoader version must be a string.");
		}
	}
}
