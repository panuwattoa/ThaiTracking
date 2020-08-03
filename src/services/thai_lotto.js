import axios from 'axios'

class ThaiLotto {
    checkLotteryResult(payload, callback){
        axios
        .post(`https://www.glo.or.th/api/checking/getcheckLotteryResult`, payload).then(resp => {
            callback(null,resp)
        })
        .catch(err => console.log(err.data))
    }

    getPeriodsByYear(payload, callback){
        axios
        .post(`https://www.glo.or.th/api/lottery/getPeriodsByYear`, payload).then(resp => {
            callback(null,resp)
        })
        .catch(err => callback(err,null))
    }
}

export default ThaiLotto