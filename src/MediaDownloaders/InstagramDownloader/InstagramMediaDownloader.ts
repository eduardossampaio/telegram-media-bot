import Chrome from "selenium-webdriver/chrome";
import { MediaDownloader } from "../MediaDownloader";
import { Builder, By } from "selenium-webdriver";

import axios from "axios";
import { MediaDownloadResponse, MediaType } from "../MediaDownloadResponse";
export class InstagramMediaDownloader implements MediaDownloader {
    
    
    downloadMidia(url: any): Promise<MediaDownloadResponse> {
       return this.downloadReel(url);
    }


    async downloadReel(url: string): Promise<MediaDownloadResponse> {
        return new Promise((resolve) => {
            this.getReelVideoUrl(url).then(videoUrl => {
                this.downloadFile(videoUrl).then(fileBuffer => {
                    const response:MediaDownloadResponse = {
                        source: "Instagram Reel",
                        type: MediaType.VIDEO,
                        buffer: fileBuffer,
                        directDownloadUrl: videoUrl
                    }
                    resolve(response)
                })
            })
        });
    }

    async downloadFile(url: string): Promise<Buffer> {
        return new Promise((resolve) => {
            const response = axios.get(url, { responseType: 'arraybuffer' }).then(response => {
                const buffer = Buffer.from(response.data, 'binary');
                resolve(buffer);
            })

        });
    }

    async getReelVideoUrl(url: string): Promise<string> {
        const options = new Chrome.Options();
        let driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(options.addArguments('--headless=new'))
            .build();

        try {
            console.log("getting url");
            await driver.manage().setTimeouts({ implicit: 5000 });
            await driver.get(url);
            let revealed = await driver.findElement(By.tagName("video"))
            console.log("video found");
            const videoUrl = await revealed.getAttribute("src")
            console.log(videoUrl)
            driver.quit();
            return videoUrl as string;

        } catch (err) {
            driver.quit();
            return undefined;
        }

    }
}