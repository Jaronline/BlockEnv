import createProgram from "../packages/blockenv/dist/index.js";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { Command } from "commander";

const rootDir = new URL("../", import.meta.url);
const outputDir = new URL("./apps/website/docs/commands/_generated_help/", rootDir);

if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
}

const rootProgram = createProgram();

const results = await Promise.all(
    [rootProgram, ...rootProgram.commands].map(async command => {
        try {
            const output = customFormat(command);
            const destURL = new URL(`./${command.name()}.md`, outputDir);
            await writeFile(destURL, output, { encoding: "utf-8" });
            return { command: command.name(), success: true };
        } catch (err) {
            console.error(`Error processing command '${command.name()}':`, err);
            return { command: command.name(), success: false, error: err };
        }
    })
);

/**
 *
 * @param { Command } command
 * @returns {string}
 */
function customFormat(command) {
    const help = command.createHelp();

    let md = `## Usage \n\n\`\`\`\n${help.commandUsage(command)}\n\`\`\`\n\n${help.commandDescription(command)}\n\n`;

    const optionGroups = help.groupItems(command.options, help.visibleOptions(command), (option) => option.helpGroupHeading ?? "Options:");
    if (optionGroups.size > 0) {
        optionGroups.forEach((options, group) => {
            md += `### ${group.replace(/(.*):/, "$1")}\n\n`;
            md += "| Option | Description |\n";
            md += "|--------|-------------|\n";
            md += options.map( (option) => {
                return `| ${help.optionTerm(option)} | ${help.optionDescription(option)} |`
            }).join("\n") + "\n\n";
        });
    }

    const commandGroups = help.groupItems(command.commands, help.visibleCommands(command), (sub) => sub.helpGroup() || "Commands:");
    if (commandGroups.size > 0) {
        commandGroups.forEach((commands,group) => {
            md += `### ${group.replace(/(.*):/, "$1")}\n\n`;
            md += "| Sub Command | Description |\n";
            md += "|--------|-----------------|\n";
            md += commands.map( (sub) => {
                return `| ${help.subcommandTerm(sub)} | ${help.subcommandDescription(sub)} |`
            }).join("\n") + "\n\n";
        });
    }

    return md.replaceAll("<","&lt;").replaceAll(">","&gt;");

}

// Optionally, check for errors and exit with non-zero code if any failed
const failed = results.filter(r => !r.success);
if (failed.length > 0) {
    console.error(`\n${failed.length} command(s) failed to generate help docs.`);
    process.exit(1);
}
