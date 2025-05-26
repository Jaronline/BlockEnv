#!/usr/bin/env node
const { Command } = require("commander");
const { version } = require("../package.json");

const program = new Command("blockenv")
    .description("a Minecraft modpack testing environment CLI")
    .version(version);

require("./commands/clean").loadCommands(program);
require("./commands/setup").loadCommands(program);
require("./commands/launch").loadCommands(program);

try {
    program.parse(process.argv);
} catch (error) {
    program.error(error instanceof Error ? error.message : error);
}