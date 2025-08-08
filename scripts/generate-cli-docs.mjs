import createProgram from "../packages/blockenv/dist/index.js";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import stripAnsi from "strip-ansi";

const rootDir = new URL("../", import.meta.url);
const outputDir = new URL("./apps/website/docs/commands/_generated_help/", rootDir);

if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
}

const rootProgram = createProgram();

const results = await Promise.all(
    [rootProgram, ...rootProgram.commands].map(async command => {
        try {
            const help = command.createHelp();
            const output = help.formatHelp(command, help);
            const destURL = new URL(`./${command.name()}.md`, outputDir);
            const content = stripAnsi(output.trim());
            const mdContent = "```bash\n" + content + "\n```";
            await writeFile(destURL, mdContent, { encoding: "utf-8" });
            return { command: command.name(), success: true };
        } catch (err) {
            console.error(`Error processing command '${command.name()}':`, err);
            return { command: command.name(), success: false, error: err };
        }
    })
);

// Optionally, check for errors and exit with non-zero code if any failed
const failed = results.filter(r => !r.success);
if (failed.length > 0) {
    console.error(`\n${failed.length} command(s) failed to generate help docs.`);
    process.exit(1);
}
