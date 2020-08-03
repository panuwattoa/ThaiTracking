import express from 'express';
import Notify from './api/line_notify.js';
import lottery from './src/services/thai_lotto.js'
import bodyParser from 'body-parser';
import axios from 'axios'

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
app.post('/api/thaipost', async (req, res) => {
    // const todaysDate = new Date()
    // const currentYear = todaysDate.getFullYear()
    // let resp = await axios.post(`https://www.glo.or.th/api/lottery/getPeriodsByYear`, {"year":"2020","type":"CHECKED"})
    // //let resp = lotto.getPeriodsByYear({"year":"2020","type":"CHECKED"})
    // res.send(resp.data);
});

// todo: support other date prize
app.post('/api/line/lottery', async (req, res) => {
    console.log(req.body)
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
    if (req.body.events[0].message.type !== 'text') {
        lineNotify.replyMessage(payload)
        return
    }
    let text = req.body.events[0].message.text

    if (!Number(text) || text.length !== 6) {
        lineNotify.replyMessage(payload)
        return
    }

      const todaysDate = new Date()
      const currentYear = todaysDate.getFullYear()
      let resp = await lotto.getPeriodsByYear({"year":currentYear.toString(),"type":"CHECKED"})
      console.log("currentYear " + currentYear +  "resp " + resp.data.response + " typeof " + typeof currentYear)
      if(resp && resp.data.response){
        let respPrize = await lotto.checkLotteryResult({"number":[{"lottery_num":text}],"period_date":resp.data.response.result[0].date})
        if(respPrize && respPrize.data.response){
                console.log("respPrize.data " + respPrize.data)
                if(respPrize.data.response.result[0].statusType === 1) {
                    payload.messages[0].text = "ยินดีด้วย ถูกรางวัล " + respPrize.data.response.result[0].status_data[0].reward + " ประจำวันที่ " + resp.data.response.result[0].date + " หมายเลข" + respPrize.data.response.result[0].number
                }else{
                    payload.messages[0].text = "ไม่ถูกรางวัลประจำวันที่ " + resp.data.response.result[0].date
                }
            }
        lineNotify.replyMessage(payload)
      }else{
        lineNotify.replyMessage(payload)
      }

    res.send('DONE');
});