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
module.exports.Environment = class Environment {
    #data;

    constructor(data) {
        this.#data = data;
        this.#validateData();
    }

    get name() {
        return this.#data.name;
    }

    get type() {
        return this.#data.type;
    }

    get path() {
        return this.#data.path;
    }

    get playerName(){
        return this.#data.playerName ?? null;
    }

    #validateData(data = this.#data) {
        if (!data || typeof data !== "object" || Array.isArray(data)) {
            throw new Error("Environment data must be an object.");
        }
        if (!data.name || typeof data.name !== "string") {
            throw new Error("Environment name must be a string.");
        }
        if (!data.type || (data.type !== "client" && data.type !== "server")) {
            throw new Error("Environment type must be 'client' or 'server'.");
        }
        if (!data.path || typeof data.path !== "string") {
            throw new Error("Environment path must be a string.");
        }
        this.#validatePlayerName();
    }

    #validatePlayerName(data = this.#data) {
        if (!data.playerName) {
            return;
        }
        if(data.type == "server"){
            throw new Error("Environment playerName can not be set in a server type environment");
        }
        if(typeof data.playerName !== "string"){
            throw new Error("Environment playerName must be a string.");
        }
        if (data.playerName.length === 0) {
            throw new Error("Environment playerName cannot be empty.");
        }
        if (!/^[A-Za-z0-9_]+$/.test(data.playerName)) {
            throw new Error("Environment playerName can only contain letters, numbers, and underscores.");
        }
        if (data.playerName.length > 16) {
            throw new Error("Environment playerName is too long");
        }
    }
}