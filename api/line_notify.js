import axios from 'axios'
import config from './config.js'
class Notify{
    
    constructor({tokenNotify, tokenBot }) {
        this.http = axios.create();
        this.tokenNotify = tokenNotify
        this.tokenBot = tokenBot
    }

    //https://developers.line.me/businessconnect/api-reference#sending_message
    Notify(args){
        return new Promise((resolve, reject)=>{
            this.http.defaults.headers.common['Authorization'] = "Bearer " + this.tokenNotify;
            this.http.post(config.URL_LINE.SEND, {
                messages: args.messages,
              }).then(res=>{
                const body = res.body
                resolve(body)
            })
            .catch(err=>{
                reject(err.error)
            });
        })
    }

    replyMessage(args){
        return new Promise((resolve, reject)=>{
            this.http.defaults.headers.common['Authorization'] = "Bearer " + this.tokenBot;
            this.http.post(`${config.URL_LINE.MESSAGING_API_PREFIX}/message/reply`, {
                messages: args.messages,
                replyToken: args.replyToken,
              }).then(res=>{
                const body = res.body
                resolve(body)
            })
            .catch(err=>{
                reject(err.error)
            });
        })
    }
}

export default Notify
