const { Command } = require("commander");
const { parseSide } = require("../../options/side");

/**
 * @param {Command} program
 */
module.exports.loadCommands = function(program) {
    program
        .command("launch")
        .description("Launch the Minecraft client or server")
        .option("-s, --side <side>", "Whether to launch the server or client (default: client)", parseSide)
        .option("-p, --profile <profile>", "The client profile to launch")
        .action(async (options) => {
            try {
                await runLaunch(program.version(), options);
            } catch (error) {
                program.error(error.message);
            }
        });
}

async function runLaunch(version, options) {
    const { side = "client" } = options;
    switch (side) {
        case "client":
            await require("./client").launchClient(version, options);
            break;
        case "server":
            await require("./server").launchServer(options);
            break;
    }
}