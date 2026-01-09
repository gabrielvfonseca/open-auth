// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";

const { docs, meta } = defineDocs({
  dir: "content",
});
const source_config_default = defineConfig();
export { source_config_default as default, docs, meta };
