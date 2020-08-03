import axios from 'axios'

class ThaiLotto {
    async checkLotteryResult(payload){
         return axios.post(`https://www.glo.or.th/api/checking/getcheckLotteryResult`, payload)
    }

    async getPeriodsByYear(payload){
        return axios.post(`https://www.glo.or.th/api/lottery/getPeriodsByYear`, payload)
    }
}

export default ThaiLotto