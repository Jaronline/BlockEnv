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
function validateOptions(options) {
	if (typeof options !== "object" || options === null) {
		throw new TypeError("Options must be an object.");
	}
	if ("hooks" in options) {
		if (!(typeof options.hooks === "object" && options.hooks !== null && !Array.isArray(options.hooks))) {
			throw new TypeError("Hooks must be an object.");
		}
		if (Object.values(options.hooks).some((hook) => typeof hook !== "function")) {
			throw new TypeError("All hooks must be functions.");
		}
	}
}

class DownloadStrategy {
	#defaultOptions;

	constructor(defaultOptions = {}) {
		this.#defaultOptions = defaultOptions;
		Object.freeze(this._download);
	}

	get defaultOptions() {
		return this.#defaultOptions;
	}

	_download(url, options = {}) {
		this.#validateOptions(url, options);
		return this.#hookedDownload(url, options);
	}

	/**
	 * @param {string} url
	 * @param {any} options
	 * @returns {Promise<unknown>}
	 */
	download(url, options = {}) {
		throw new Error("Download method not implemented.");
	}

	async #hookedDownload(url, options = {}) {
		options.hooks?.onDownloadStart?.({ url, options });
		const result = await this.download(url, options);
		options.hooks?.onDownloadEnd?.({ url, options });
		return result;
	}

	#validateOptions(url, options) {
		if (typeof url !== "string" || !url.trim()) {
			throw new TypeError("URL must be a non-empty string.");
		}
		validateOptions(options);
	}
}

class BatchDownloadStrategy {
	#defaultOptions;

	constructor(defaultOptions = {}) {
		this.#defaultOptions = {
			batchSize: 100,
			...defaultOptions
		};
		Object.freeze(this._download);
	}

	get defaultOptions() {
		return this.#defaultOptions;
	}

	_download(urls, options = {}) {
		this.#validateOptions(urls, options);
		return this.#hookedDownload(urls, options);
	}

	_downloadInBatches(urls, batchSize = this.#defaultOptions.batchSize, options = {}) {
		this.#validateOptions(urls, options);
		if (typeof batchSize !== "number" || batchSize <= 0) {
			throw new TypeError("Batch size must be a positive number.");
		}
		return this.#hookedDownloadBatches(urls, batchSize, options);
	}

	/**
	 * @param {string} url
	 * @param {any} options
	 * @returns {Promise<unknown>}
	 */
	downloadItem(url, options = {}) {
		throw new Error("Download item method not implemented.");
	}

	transformItemOptions(index, url, options) {
		return options;
	}

	async #hookedDownloadBatches(urls, batchSize, options = {}) {
		const batchCount = Math.ceil(urls.length / batchSize);

		options.hooks?.onBatchListStart?.({ urls, batchSize, options });

		for (let batchIndex = 0; batchIndex < urls.length; batchIndex += batchSize) {
			const batch = urls.slice(batchIndex, batchIndex + batchSize);
			await this.#hookedDownload(batch, options, { batchIndex, batchCount });
		}

		options.hooks?.onBatchListEnd?.({ urls, batchSize, options });
	}

	async #hookedDownload(urls, options = {}, { batchIndex = 0, batchCount = 1 } = {}) {
		options.hooks?.onBatchDownloadStart?.({ urls, batchIndex, options, batchCount });

		const result = await Promise.all(urls.map(async (url, index) => {
			const optionsForItem = this.transformItemOptions(batchIndex + index, url, options);
			options.hooks?.onDownloadStart?.({ index, url, batchIndex, options: optionsForItem });

			const result = await this.downloadItem(url, optionsForItem)
				.catch(error => {
					return options.hooks?.onDownloadError?.({ error, index, url, batchIndex, options: optionsForItem })
						|| Promise.reject(error);
				});

			options.hooks?.onDownloadEnd?.({ index, url, batchIndex, options: optionsForItem });

			return result;
		}));

		options.hooks?.onBatchDownloadEnd?.({ urls, batchIndex, options });

		return result;
	}

	#validateOptions(urls, options) {
		if (!Array.isArray(urls) || urls.length === 0) {
			throw new TypeError("URLs must be a non-empty array.");
		}
		validateOptions(options);
	}
}

module.exports = {
	DownloadStrategy,
    BatchDownloadStrategy
};
