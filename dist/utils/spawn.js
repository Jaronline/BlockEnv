const { spawn } = require("node:child_process");

module.exports = function(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { stdio: "inherit", ...options });

        child.on("error", (error) => {
            reject(error);
        });

        child.on("exit", (code) => {
            if (code !== 0) {
                reject(new Error(`Command "${command}" failed with exit code ${code}`));
            } else {
                resolve();
            }
        });
    });
}