const spawnAsync = require("./spawn");
const { usingWindows } = require("./os");

module.exports.runServer = async function(path) {
    console.log("Starting up server with run script...");
    const isWindows = usingWindows();
    const command = isWindows ? "cmd.exe" : "./run.sh";
    const args = isWindows ? ["/c", "run.bat"] : [];
    await spawnAsync(command, args, {
        cwd: path
    });
}