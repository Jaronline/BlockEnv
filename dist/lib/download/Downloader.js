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
const { DownloadStrategy, BatchDownloadStrategy } = require("./DownloadStrategy");

module.exports = class Downloader {
	#downloadStrategy;
	#batchDownloadStrategy;

	constructor({
					downloadStrategy = new DownloadStrategy(),
					batchDownloadStrategy = new BatchDownloadStrategy()
	} = {}) {
		this.downloadStrategy = downloadStrategy;
		this.batchDownloadStrategy = batchDownloadStrategy;
	}

	get downloadStrategy() {
		return this.#downloadStrategy;
	}

	set downloadStrategy(downloadStrategy) {
		if (!(downloadStrategy instanceof DownloadStrategy)) {
			throw new TypeError("downloadStrategy must be an instance of DownloadStrategy.");
		}
		this.#downloadStrategy = downloadStrategy;
	}

	get batchDownloadStrategy() {
		return this.#batchDownloadStrategy;
	}

	set batchDownloadStrategy(batchDownloadStrategy) {
		if (!(batchDownloadStrategy instanceof BatchDownloadStrategy)) {
			throw new TypeError("batchDownloadStrategy must be an instance of BatchDownloadStrategy.");
		}
		this.#batchDownloadStrategy = batchDownloadStrategy;
	}

	download(url, options = {}) {
		return this.#downloadStrategy._download(url, options);
	}

	downloadBatch(urls, options = {}) {
		return this.#batchDownloadStrategy._download(urls, options);
	}

	downloadBatches(urls, options = {}) {
		return this.#batchDownloadStrategy._downloadInBatches(urls, options.batchSize, options);
	}
}
