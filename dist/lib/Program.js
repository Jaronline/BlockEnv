const { Command } = require("commander");

module.exports = class Program extends Command {
    #config = {};

    config(config) {
        if (config) {
            this.#config = config;
            return this;
        }
        return this.#config;
    }
}