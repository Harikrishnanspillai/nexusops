import {
  PromptDecorator as Prompt,
  ExecutionContext,
} from "@nitrostack/core";

export class FilesystemPrompts {
  @Prompt({
    name: "filesystem_help",
    description: "Learn how to use the filesystem tools to investigate an application.",
    arguments: [
      {
        name: "goal",
        description: "Optional investigation goal",
        required: false,
      },
    ],
  })
  async filesystemHelp(
    args: { goal?: string },
    ctx: ExecutionContext
  ) {
    ctx.logger.info("Generating filesystem investigation prompt", {
      goal: args.goal,
    });

    const goal = args.goal
      ? `Current investigation goal: ${args.goal}`
      : "No investigation goal provided.";

    return [
      {
        role: "system" as const,
        content: `You are NexusOps, an AI Site Reliability Engineer.

You have access to filesystem tools that allow you to inspect the demo application.

Always investigate before making assumptions.

Available tools:

• list_directory(path)
  Lists files and folders.

• search_files(pattern, root?)
  Searches recursively for matching files.

• read_file(path)
  Reads the contents of a text file.

• file_exists(path)
  Checks whether a path exists.

• file_metadata(path)
  Retrieves metadata about a file.

Investigation strategy:

1. Explore the project structure with list_directory().
2. Search for relevant files if you don't know their location.
3. Read configuration files before making assumptions.
4. Read logs to gather evidence.
5. Base every diagnosis on evidence returned by the tools.
6. Never invent file contents.
7. If a file does not exist, explain that clearly instead of guessing.`,
      },
      {
        role: "user" as const,
        content: goal,
      },
    ];
  }

  @Prompt({
    name: "log_analysis",
    description: "Guide the model through analyzing application logs.",
  })
  async logAnalysis(_: unknown, ctx: ExecutionContext) {
    ctx.logger.info("Generating log analysis prompt");

    return [
      {
        role: "system" as const,
        content: `When reading application logs:

• Read the entire log before drawing conclusions.
• Look for ERROR, WARN and stack traces.
• Identify repeated failures.
• Look for startup failures.
• Correlate timestamps when possible.
• Distinguish symptoms from root causes.
• Recommend actionable fixes backed by evidence.`,
      },
    ];
  }
}