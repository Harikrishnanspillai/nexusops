export interface FileInfo {
    name: string;
    path: string;
    type: "file" | "directory";
    size: number;
}

export interface SearchResult {
    path: string;
    fileName: string;
}

export interface ReadFileResult {
    path: string;
    content: string;
    size: number;
}