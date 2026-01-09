import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { build } from "bun";
import { consola } from "consola";

const cwd = process.cwd();
const distDir = join(cwd, "dist");

// Clean dist directory
if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
}

// Read package.json to get dependencies
const pkg = await Bun.file("package.json").json();
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  "server-only",
];

const buildResult = await build({
  entrypoints: ["src/index.ts"],
  outdir: "dist",
  target: "node",
  format: "esm",
  sourcemap: "external",
  minify: true,
  external,
  root: "./src",
});

if (!buildResult.success) {
  consola.error("Build failed");
  for (const message of buildResult.logs) {
    consola.error(message);
  }
  process.exit(1);
}

// Generate types
consola.info("Generating type declarations...");
const tscResult = Bun.spawnSync(["bun", "x", "tsc", "--emitDeclarationOnly"], {
  stdout: "inherit",
  stderr: "inherit",
});

if (tscResult.exitCode !== 0) {
  consola.error("Type declaration generation failed");
  process.exit(1);
}

consola.success("Build successful");
