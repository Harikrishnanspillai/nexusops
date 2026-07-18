import { Module } from "@nitrostack/core";

import { FilesystemModule } from "./filesystem/filesystem.module.js";

@Module({
  name: "nexusops",
  description: "AI-powered incident response platform.",
  imports: [
    FilesystemModule,
  ],
})
export class NexusOpsModule { }