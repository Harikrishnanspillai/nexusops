import { z } from "@nitrostack/core";

export const ReadFileSchema = z.object({
    path: z.string().describe("Relative path of the file to read")
});

export type ReadFileDto = z.infer<typeof ReadFileSchema>;