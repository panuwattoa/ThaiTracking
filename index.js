import express from 'express';
import Notify from './api/line_notify.js';
import lottery from './src/services/thai_lotto.js'
import bodyParser from 'body-parser';
const json = express;
const app = express();
app.use(json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env.PORT || 3000

startServer();
const lineNotify = new Notify({tokenBot: "6NU04QoAWz8TykxkhP9gsljzY1zPBeBta6k41CHLGkZUjrzZ10BcwFq0NeuvyH7e1nHU7MPlYurP7101dQ8f3Lr+baSycSXx/sLA+IHrwH7USdvhD0/vV68ma1AbmXQYk/VF6udov+jRCxC9g8LnqQdB04t89/1O/w1cDnyilFU="})
const lotto = new lottery();

function startServer() {
    app.listen(port, "0.0.0.0", function () {
        console.log('Starting node.js on port ' + port);
        app.emit("appStarted");
    });
}

app.get('/', (req, res) => {
    res.send('<h1>Invalid </h1>');
});

// todo:
app.post('/api/thaipost', (req, res) => {
    res.send('<h1>Hello </h1>');
});

// todo: support other date prize
app.post('/api/line/lottery', (req, res) => {
    console.log(req.body)

    if (req.body.events[0].message.type !== 'text') {
        return
    }
    let text = req.body.events[0].message.text

    const payload = {
        replyToken: req.body.events[0].replyToken,
        messages: [
          {
            type: 'text',
            text:
              'ไม่สามารถตรวจผลสลากกินแบ่งได้',
          },
        ],
      }
      const todaysDate = new Date()
      const currentYear = todaysDate.getFullYear()
      let resp = await lotto.getPeriodsByYear({"year":currentYear,"type":"CHECKED"})
      if(resp){
        let respPrize = await lotto.checkLotteryResult({"number":[{"lottery_num":text}],"period_date":resp.response.result[0].date})
        if(respPrize){
                console.log("respPrize " + respPrize)
                if(respPrize.response.result[0].statusType === 1) {
                    payload.messages[0].text = "ยินดีด้วย ถูกรางวัล " + respPrize.response.result[0].status_data[0].reward + " ประจำวันที่ " + resp.response.result[0].date + " หมายเลข" + respPrize.response.result[0].number
                }else{
                    payload.messages[0].text = "ไม่ถูกรางวัลประจำวันที่ " + resp.response.result[0].date
                }
            }else{
                lineNotify.replyMessage(payload)
        }
      }else{
        lineNotify.replyMessage(payload)
      }

    res.send('DONE');
});