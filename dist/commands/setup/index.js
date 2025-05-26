const { Command } = require("commander");
const { parseSide, parseLoader } = require("../../options");

/**
 * @param {Command} program
 */
module.exports.loadCommands = function(program) {
    program
        .command("setup")
        .description("Setup the testing environment")
        .option("-s, --side <side>", "Whether to setup the server or client", parseSide)
        .option("-m, --minecraft-version <version>", "Specify the Minecraft version to use")
        .requiredOption("-l, --loader <loader>", "Specify the modloader to use (currently only 'neoforge' is supported)", "neoforge", parseLoader)
        .requiredOption("--loader-version <version>", "Specify the modloader version to use")
        .action(async (options) => {
            try {
                await runSetup(options);
            } catch (error) {
                program.error(error.message);
            }
        });
}

async function runSetup(options) {
    const { side } = options;
    if (!side || side == "client") {
        await require("./client").setupClient(options);
    }
    if (!side || side == "server") {
        await require("./server").setupServer(options);
    }
}