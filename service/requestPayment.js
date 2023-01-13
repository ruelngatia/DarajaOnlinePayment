const axios = require('axios')
const e = require('cors')
const env = require('dotenv')
env.config()


const authURL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
const stkInitialize = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
const callbackURL = "https://mydomain.com/path"

const getTimeStamp = ()=>{
      // get time stamp 
      const today = new Date()
      let YYYY = today.getFullYear()
      let MM = today.getMonth() + 1; // Months start at 0!
      let DD = today.getDate()
      let HH = today.getHours()
      let mm = today.getMinutes()
      let ss = today.getSeconds()
  
      if (DD < 10) dd = '0' + dd;
      if (MM < 10) mm = '0' + mm;
      return '' + YYYY + MM + DD + HH + mm + ss
}

const calculateAuth = ()=>{
    return btoa(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`)
}

const getToken = async()=>{
    const config = {
        headers: {
            authorization: 'Basic '+ calculateAuth()  
        }
    }
    let result =await axios.get(authURL,config)
    return `Bearer ${result.data.access_token}`
}

const initiatePayment = async (PhoneNumber,amount)=>{
  
    let details = {
        BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
        Password : process.env.PASSWORD,
        Timestamp: getTimeStamp(),
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: PhoneNumber,
        PartyB: process.env.BUSINESS_SHORT_CODE,
        PhoneNumber: PhoneNumber,
        CallBackURL: callbackURL,
        AccountReference: process.env.ACCOUNT_REFERENCE,
        TransactionDesc: `Payment of ksh${amount}`
    }

    const config = {headers: {
        'content-type': 'text/json',
        'Authorization': await getToken()
    }}
    const result =await axios.post(stkInitialize,details,config)
    return result.data.ResponseCode === 0 ?true: false
}


module.exports = {initiatePayment}