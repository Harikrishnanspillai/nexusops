import * as fs from "node:fs/promises";
import * as path from "node:path";
import { existsSync } from "node:fs";

export interface FileEntry {
  name: string;
  path: string;
  type: "file" | "directory";
  size: number;
}

export interface ReadFileResult {
  path: string;
  size: number;
  content: string;
}

export interface SearchResult {
  fileName: string;
  path: string;
}

export class FilesystemService {
  /**
   * Root directory the AI is allowed to inspect.
   *
   * Change this if your demo lives elsewhere.
   */
  private readonly root = path.resolve(process.cwd(), "demo-system");

  /**
   * Prevent directory traversal attacks.
   */
  private resolvePath(relativePath: string): string {
    const resolved = path.resolve(this.root, relativePath);

    if (!resolved.startsWith(this.root)) {
      throw new Error("Access outside demo-system is not allowed.");
    }

    return resolved;
  }

  /**
   * Read a text file.
   */
  async readFile(relativePath: string): Promise<ReadFileResult> {
    const file = this.resolvePath(relativePath);

    const stat = await fs.stat(file);

    if (!stat.isFile()) {
      throw new Error(`${relativePath} is not a file.`);
    }

    const content = await fs.readFile(file, "utf8");

    return {
      path: relativePath,
      size: stat.size,
      content,
    };
  }

  /**
   * List a directory.
   */
  async listDirectory(relativePath = "") {
    const directory = this.resolvePath(relativePath);

    const entries = await fs.readdir(directory, {
      withFileTypes: true,
    });

    const result: FileEntry[] = [];

    for (const entry of entries) {
      const full = path.join(directory, entry.name);
      const stat = await fs.stat(full);

      result.push({
        name: entry.name,
        path: path.join(relativePath, entry.name),
        type: entry.isDirectory() ? "directory" : "file",
        size: stat.size,
      });
    }

    result.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }

      return a.type === "directory" ? -1 : 1;
    });

    return {
      path: relativePath || ".",
      entries: result,
    };
  }

  /**
   * Check existence.
   */
  exists(relativePath: string): boolean {
    const file = this.resolvePath(relativePath);

    return existsSync(file);
  }

  /**
   * Recursive search.
   *
   * Supports:
   *
   * app.log
   * *.log
   * docker
   */
  async searchFiles(
    pattern: string,
    relativeRoot = ""
  ): Promise<SearchResult[]> {
    const start = this.resolvePath(relativeRoot);

    const results: SearchResult[] = [];

    await this.walk(start, relativeRoot, pattern.toLowerCase(), results);

    return results;
  }

  /**
   * Recursive walker.
   */
  private async walk(
    absolute: string,
    relative: string,
    pattern: string,
    results: SearchResult[]
  ) {
    const entries = await fs.readdir(absolute, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const absolutePath = path.join(absolute, entry.name);
      const relativePath = path.join(relative, entry.name);

      if (entry.isDirectory()) {
        await this.walk(
          absolutePath,
          relativePath,
          pattern,
          results
        );
        continue;
      }

      const lower = entry.name.toLowerCase();

      let match = false;

      if (pattern.startsWith("*.")) {
        match = lower.endsWith(pattern.substring(1));
      } else {
        match = lower.includes(pattern);
      }

      if (match) {
        results.push({
          fileName: entry.name,
          path: relativePath,
        });
      }
    }
  }

  /**
   * Basic metadata.
   */
  async getMetadata(relativePath: string) {
    const target = this.resolvePath(relativePath);

    const stat = await fs.stat(target);

    return {
      path: relativePath,
      isDirectory: stat.isDirectory(),
      isFile: stat.isFile(),
      size: stat.size,
      created: stat.birthtime,
      modified: stat.mtime,
    };
  }

  /**
   * Root information.
   */
  getRootInfo() {
    return {
      root: this.root,
      allowedDirectory: "demo-system",
    };
 
}
}