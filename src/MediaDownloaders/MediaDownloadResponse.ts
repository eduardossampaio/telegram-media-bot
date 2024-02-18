export enum MediaType{
    VIDEO
}

export interface MediaDownloadResponse {
    source: string,
    type: MediaType,
    buffer: Buffer,
    directDownloadUrl? : string
}