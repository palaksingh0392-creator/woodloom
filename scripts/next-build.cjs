const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = fs.realpathSync.native(path.resolve(__dirname, ".."));
process.chdir(projectRoot);

const nextCli = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");
const result = spawnSync(process.execPath, [nextCli, "build", "--webpack"], {
  cwd: projectRoot,
  env: process.env,
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
