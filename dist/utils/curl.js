const { spawn } = require("node:child_process");

function validateUrl(url) {
    try {
        new URL(url);
    } catch (e) {
        throw new Error(`Invalid curl URL: ${url}`);
    }
}

function validateOptions(options) {
    if (typeof options !== "object") {
        throw new Error("Options must be an object");
    }
    if (options.silent && typeof options.silent !== "boolean") {
        throw new Error("Silent option must be a boolean");
    }
    if (options.showError && typeof options.showError !== "boolean") {
        throw new Error("ShowError option must be a boolean");
    }
    if (options.failOnError && typeof options.failOnError !== "boolean") {
        throw new Error("FailOnError option must be a boolean");
    }
    if (options.location && typeof options.location !== "boolean") {
        throw new Error("Location option must be a boolean");
    }
    if (options.ip && options.ip !== "ipv4" && options.ip !== "ipv6") {
        throw new Error("IP option must be either 'ipv4' or 'ipv6'");
    }
    if (options.retry && (typeof options.retry !== "number" || options.retry <= 0)) {
        throw new Error("Retry option must be a positive number");
    }
    if (options.output && typeof options.output !== "string") {
        throw new Error("Output option must be a string");
    }
}

function optionsToArgs(options) {
    const args = [];
    if (options.silent) {
        args.push("-s");
    }
    if (options.showError) {
        args.push("-S");
    }
    if (options.failOnError) {
        args.push("-f");
    }
    if (options.location) {
        args.push("-L");
    }
    if (options.ip === "ipv4") {
        args.push("-4");
    }
    if (options.ip === "ipv6") {
        args.push("-6");
    }
    if (options.retry) {
        args.push("--retry", options.retry.toString());
    }
    if (options.output) {
        args.push("-o", options.output);
    }
    return args;
}

module.exports = function(url, options = {}) {
    return new Promise((resolve, reject) => {
        try {
            validateUrl(url);
            validateOptions(options);

            const args = [...optionsToArgs(options), url];
            const curl = spawn("curl", args);

            curl.on("close", (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`curl exited with code ${code}`));
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}