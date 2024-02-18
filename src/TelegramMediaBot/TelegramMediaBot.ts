import TelegramBot from "node-telegram-bot-api";
import { InstagramMediaDownloader } from "../MediaDownloaders/InstagramDownloader/InstagramMediaDownloader";
import { response } from "express";
import { MediaDownloadResponse } from "../MediaDownloaders/MediaDownloadResponse";

export class TelegramMediaBot{
    bot: TelegramBot;
    startup() {
        const token = process.env.TELEGRAM_MEDIA_BOT_API;
        this.bot = new TelegramBot(token, {polling: true});
    }

    run() {
        this.bot.on('message', (msg) => {
            const chatId = msg.chat.id;     
            const message = msg.text;                               
            this.handleMessage(message,chatId);
        });

        this.bot.on('photo', (msg) => {
            const chatId = msg.chat.id;                    
            this.bot.sendMessage(chatId, 'Desculpa eu só consigo entender textos');
        })
        this.bot.on('video', (msg) => {
            const chatId = msg.chat.id;                    
            this.bot.sendMessage(chatId, 'Desculpa eu só consigo entender textos');
        })
    }

    handleMessage(message:string, chatId){
        console.log(message);
      
        if(message === "/start"){
            this.handleStart(message,chatId);
            return;
        }

        if(message.startsWith("http")){
            this.handleUrl(message,chatId);
            return;
        }
    }

    handleStart(message:string, chatId){
        this.bot.sendMessage(chatId, 'OI, sou o bot de download de midias');
        this.bot.sendMessage(chatId, 'compartilhe links de coisas legais que você ve nas redes sociais e eu baixo pra você');
        this.bot.sendMessage(chatId, "no momento eu suporto as seguintes coisas")
        this.bot.sendMessage(chatId, '**Instagram reels**');                
    }

    handleUrl(url:string, chatId){
        if(url.startsWith("https://www.instagram.com/reel")){
            this.bot.sendMessage(chatId,"vou baixar esse reels para você")
            new InstagramMediaDownloader().downloadMidia(url).then(response => {
                this.sendVideo(chatId,response)
            }).catch(err => {
                this.bot.sendMessage(chatId, "Me desculpa, não consegui baixar esse video")
            })

            return;
        }else{
            this.bot.sendMessage(chatId, "Me desculpa, no momento só consigo baixar instagram reels")
        }
    }

    private sendVideo(chatId, videoDownload: MediaDownloadResponse){
        if(this.excedMaximumSize(videoDownload.buffer)){
            this.bot.sendMessage(chatId, "Este vídeo excede o tamanho máximo de 50 MB")
            if(videoDownload.directDownloadUrl){
                this.bot.sendMessage(chatId, "Tente baixar diretamente pelo link")
                this.bot.sendMessage(chatId, videoDownload.directDownloadUrl)
            }
            return;
        }
        this.bot.sendVideo(chatId,videoDownload.buffer)
    }

    private excedMaximumSize(buffer:Buffer): boolean{
        return (buffer.length * 1024 * 1024) >= 50;
    }

}

