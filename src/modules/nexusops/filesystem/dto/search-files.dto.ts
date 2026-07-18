import { z } from "@nitrostack/core";

export const SearchFilesSchema = z.object({
    root: z.string().describe("Root directory"),
    pattern: z.string().describe("File name or extension")
});

export type SearchFilesDto = z.infer<typeof SearchFilesSchema>;