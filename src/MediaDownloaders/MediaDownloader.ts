import { MediaDownloadResponse } from "./MediaDownloadResponse";

export interface MediaDownloader{
    downloadMidia(url): Promise<MediaDownloadResponse>
}