import { Module } from "@nitrostack/core";

import { FilesystemTools } from "./filesystem.tools.js";
import { FilesystemResources } from "./filesystem.resources.js";
import { FilesystemPrompts } from "./filesystem.prompts.js";

@Module({
  name: "filesystem",
  description: "Filesystem inspection tools for NexusOps.",
  controllers: [
    FilesystemTools,
    FilesystemResources,
    FilesystemPrompts,
  ],
})
export class FilesystemModule {}