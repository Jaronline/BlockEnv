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
const { Command } = require("commander");
const Downloader = require("./download/Downloader");

module.exports = class Program extends Command {
    #config = {};
	#downloader = new Downloader();

    config(config) {
        if (config) {
            this.#config = config;
            return this;
        }
        return this.#config;
    }

	downloadStrategy(strategy) {
		if (strategy) {
			this.#downloader.downloadStrategy = strategy;
			return this;
		}
		return this.#downloader.downloadStrategy;
	}

	batchDownloadStrategy(strategy) {
		if (strategy) {
			this.#downloader.batchDownloadStrategy = strategy;
			return this;
		}
		return this.#downloader.batchDownloadStrategy;
	}

	allDownloadStrategy({ downloadStrategy, batchDownloadStrategy }) {
		this.#downloader.downloadStrategy = downloadStrategy;
		this.#downloader.batchDownloadStrategy = batchDownloadStrategy;
		return this;
	}

	get downloader() {
		return this.#downloader;
	}
}
