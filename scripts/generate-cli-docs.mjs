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

await Promise.all(
    [rootProgram, ...rootProgram.commands]
        .map(command => ({command, help: command.createHelp()}))
        .map(({ command, help }) => ({ command, output: help.formatHelp(command, help) }))
        .map(({ command, output }) => ({
            destURL: new URL(`./${command.name()}.md`, outputDir), content: stripAnsi(output.trim()) }))
        .map(({ destURL, content }) => ({
            destURL, mdContent: "```bash\n" + content + "\n```" }))
        .map(({ destURL, mdContent }) =>
            writeFile(destURL, mdContent, { encoding: "utf-8" }))
);
