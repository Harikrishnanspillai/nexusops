import { z } from "@nitrostack/core";

export const ListDirectorySchema = z.object({
    path: z.string().describe("Directory to inspect")
});

export type ListDirectoryDto = z.infer<typeof ListDirectorySchema>;