const { existsSync, createWriteStream } = require("node:fs");
const { mkdir } = require("node:fs/promises");
const { join, dirname, basename } = require("node:path");
const { curl } = require("../../../utils");
const { ruleFilter } = require("../../../filters");
const { Open: unzip } = require("unzipper");

module.exports.downloadLibraries = async function({ libDir, versionJSON, osName, arch }) {
    if (!existsSync(libDir)) {
        await mkdir(libDir, { recursive: true });
    }

    console.log("Downloading libraries...");
    await Promise.all(versionJSON.libraries
        .filter(lib => ruleFilter(lib.rules, { osName, arch }))
        .map(lib => lib.downloads.artifact)
        .map(async ({ url, path }) => {
            const dest = join(libDir, path);
            const dir = dirname(dest);

            if (!existsSync(dir)) {
                console.log(`Downloading library ${path}...`);
                await mkdir(dir, { recursive: true });
                await curl(url, {
                    ip: "ipv4",
                    failOnError: true,
                    silent: true,
                    showError: true,
                    location: true,
                    output: dest,
                    retry: 3
                }).catch(err => 
                    Promise.reject(new Error(`Failed to download library ${path}: ${err.message}`)));
            }
        }));
}

async function extractNativesFromJar(jarPath, nativesDir) {
    console.log(`Extracting native library ${jarPath}...`);
    const directory = await unzip.file(jarPath);
    await Promise.all(directory.files
        .filter(entry => /\.(so|dll|dylib)$/i.test(entry.path))
        .map(entry => ({ entry, targetPath: join(nativesDir, basename(entry.path)) }))
        .filter(({ targetPath }) => !existsSync(targetPath))
        .map(({ entry, targetPath }) => new Promise((resolve, reject) => {
            entry.stream()
                .pipe(createWriteStream(targetPath))
                .on("finish", resolve)
                .on("error", reject);
        }))
    );
}

module.exports.extractNatives = async function({ nativesDir, libDir, osName, arch, versionJSON }) {
    if (!existsSync(nativesDir)) {
        await mkdir(nativesDir, { recursive: true });
    }

    console.log("Extracting native libraries...");
    const nativesName = `:natives-${osName}`;
    const filter = arch === "x86_64" ? nativesName : `${nativesName}-${arch}`;
    await Promise.all(versionJSON.libraries
        .filter(lib => new RegExp(`${filter}$`).test(lib.name))
        .map(lib => lib.downloads.artifact)
        .map(async ({ path }) => {
            const jar = join(libDir, path);
            
            if (existsSync(jar)) {
                extractNativesFromJar(jar, nativesDir);
            } else {
                return Promise.reject(new Error(`Native library ${jar} not found`));
            }
        })
    );
}