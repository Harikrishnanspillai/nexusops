import {
  ResourceDecorator as Resource,
  ExecutionContext,
} from "@nitrostack/core";

import { FilesystemService } from "./filesystem.service.js";

export class FilesystemResources {
  private readonly filesystem = new FilesystemService();

  @Resource({
    uri: "filesystem://root",
    name: "Filesystem Root",
    description: "Information about the filesystem sandbox available to NexusOps.",
    mimeType: "application/json",
    examples: {
      response: {
        root: "demo-system",
        allowedDirectory: "demo-system",
      },
    },
  })
  async getRoot(uri: string, ctx: ExecutionContext) {
    ctx.logger.info("Fetching filesystem root information");

    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(
            this.filesystem.getRootInfo(),
            null,
            2
          ),
        },
      ],
    };
  }

  @Resource({
    uri: "filesystem://tree",
    name: "Filesystem Tree",
    description: "Lists the top-level contents of the demo-system.",
    mimeType: "application/json",
  })
  async getTree(uri: string, ctx: ExecutionContext) {
    ctx.logger.info("Fetching filesystem tree");

    const tree = await this.filesystem.listDirectory("");

    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(tree, null, 2),
        },
      ],
    };
  }
}