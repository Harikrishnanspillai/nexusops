import {
  ToolDecorator as Tool,
  Widget,
  ExecutionContext,
  z,
} from "@nitrostack/core";

import { FilesystemService } from "./filesystem.service";

export class FilesystemTools {
  private readonly filesystem = new FilesystemService();

  @Tool({
    name: "read_file",
    description: "Read the contents of a text file from the demo-system.",
    inputSchema: z.object({
      path: z.string().describe("Relative path of the file to read"),
    }),
    examples: {
      request: {
        path: "logs/app.log",
      },
      response: {
        path: "logs/app.log",
        size: 248,
        content: "2025-07-18 INFO Server started...",
      },
    },
  })
  @Widget("filesystem-read-file")
  async readFile(
    input: { path: string },
    ctx: ExecutionContext
  ) {
    ctx.logger.info("Reading file", {
      path: input.path,
    });

    return await this.filesystem.readFile(input.path);
  }

  @Tool({
    name: "list_directory",
    description: "List all files and folders inside a directory.",
    inputSchema: z.object({
      path: z.string().default("").describe("Directory to inspect"),
    }),
  })
  @Widget("filesystem-directory")
  async listDirectory(
    input: { path?: string },
    ctx: ExecutionContext
  ) {
    ctx.logger.info("Listing directory", {
      path: input.path ?? ".",
    });

    return await this.filesystem.listDirectory(input.path ?? "");
  }

  @Tool({
    name: "search_files",
    description: "Recursively search for files matching a filename or extension.",
    inputSchema: z.object({
      pattern: z
        .string()
        .describe("Search pattern. Example: app.log or *.log"),

      root: z
        .string()
        .optional()
        .describe("Root directory to begin searching"),
    }),
  })
  @Widget("filesystem-search")
  async searchFiles(
    input: {
      pattern: string;
      root?: string;
    },
    ctx: ExecutionContext
  ) {
    ctx.logger.info("Searching filesystem", {
      pattern: input.pattern,
      root: input.root ?? ".",
    });

    return {
      pattern: input.pattern,
      results: await this.filesystem.searchFiles(
        input.pattern,
        input.root ?? ""
      ),
    };
  }

  @Tool({
    name: "file_exists",
    description: "Determine whether a file or directory exists.",
    inputSchema: z.object({
      path: z.string().describe("Relative path"),
    }),
  })
  async exists(
    input: { path: string },
    ctx: ExecutionContext
  ) {
    ctx.logger.info("Checking existence", {
      path: input.path,
    });

    return {
      path: input.path,
      exists: this.filesystem.exists(input.path),
    };
  }

  @Tool({
    name: "file_metadata",
    description: "Retrieve metadata for a file or directory.",
    inputSchema: z.object({
      path: z.string().describe("Relative path"),
    }),
  })
  @Widget("filesystem-metadata")
  async metadata(
    input: { path: string },
    ctx: ExecutionContext
  ) {
    ctx.logger.info("Getting metadata", {
      path: input.path,
    });

    return await this.filesystem.getMetadata(input.path);
  }
}