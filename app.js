/* eslint-disable @typescript-eslint/no-require-imports */

const http = require("http");
const fs = require("fs");
const next = require("next");

const applicationRoot = fs.realpathSync.native(__dirname);
process.chdir(applicationRoot);

if (process.env.NODE_ENV === "production") {
  const prerenderManifest = `${applicationRoot}\\.next\\prerender-manifest.json`;

  if (!fs.existsSync(prerenderManifest)) {
    console.error(
      `Missing ${prerenderManifest}. Run "npm install" and "npm run build" in the deployed application directory before restarting IIS.`,
    );
    process.exit(1);
  }
}

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port, dir: applicationRoot });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      handle(req, res);
    })
    .listen(port, hostname, () => {
      console.log(`Shissoo is running on port ${port}`);
    });
});
