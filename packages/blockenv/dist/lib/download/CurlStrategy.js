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
const { curl } = require("../../utils");
const { dirname } = require("node:path");
const { mkdir } = require("node:fs/promises");
const { existsSync } = require("node:fs");

const defaultCurlOptions = {
	ip: "ipv4",
	silent: true,
	showError: true,
	location: true,
	failOnError: true,
	retry: 3
};

async function download(url, options) {
	if ("output" in options) {
		const destDir = dirname(options.output);
		if (!existsSync(destDir))
			await mkdir(destDir, { recursive: true });
	}
	return curl(url, options);
}

class CurlStrategy extends DownloadStrategy {
	constructor(defaultOptions = {}) {
		super({
			...defaultCurlOptions,
			...defaultOptions
		});
	}

	async download(url, options = {}) {
		return download(url, {
			...this.defaultOptions,
			...options
		});
	}
}

class BatchCurlStrategy extends BatchDownloadStrategy {
	constructor(defaultOptions = {}) {
		super({
			...defaultCurlOptions,
			...defaultOptions
		});
	}

	transformItemOptions(index, url, options) {
		if ("output" in options && Array.isArray(options.output)) {
			return {
				...options,
				output: options.output[index],
			};
		}
		return options;
	}

	async downloadItem(url, options = {}) {
		return download(url, {
			...this.defaultOptions,
			...options
		});
	}
}

module.exports = {
	CurlStrategy,
	BatchCurlStrategy,
	createAllCurlStrategy(defaultOptions = {}) {
		return {
			downloadStrategy: new CurlStrategy(defaultOptions),
			batchDownloadStrategy: new BatchCurlStrategy(defaultOptions)
		};
	},
};
