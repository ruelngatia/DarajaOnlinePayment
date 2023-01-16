const axios = require("axios");
const env = require("dotenv");
const { response } = require("express");
env.config();

const authURL =
  "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
const stkInitialize =
  "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
const callbackURL = "https://mydomain.com/path";

const getTimeStamp = () => {
  // get time stamp
  const today = new Date();
  let YYYY = today.getFullYear();
  let MM = today.getMonth() + 1; // Months start at 0!
  let DD = today.getDate();
  let HH = today.getHours();
  let mm = today.getMinutes();
  let ss = today.getSeconds();

  if (DD < 10) DD = "0" + DD;
  if (MM < 10) MM = "0" + MM;
  if (HH < 10) HH = "0" + HH;
  if (mm < 10) mm = "0" + mm;
  if (ss < 10) ss = "0" + ss;

  return "" + YYYY + MM + DD + HH + mm + ss;
};

const calculateAuth = () => {
    const buffer = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`)
    const auth = 'Basic '+ buffer.toString('base64')
    return auth
};

const getToken = async () => {
    try {        
        const config = {
          headers: {
            Authorization: calculateAuth()
          },
        };
        let result = await axios.get(authURL, config);
        return `Bearer ${result.data.access_token}`;
    } catch (error) {
        throw new Error(error.message)
        
    }
};

const initiatePayment = async (PhoneNumber, amount) => {
  try {
    const timestamp = getTimeStamp();
    let Password = Buffer.from(
      `${process.env.BUSINESS_SHORT_CODE}${process.env.PASSKEY}${timestamp}`
    ).toString("base64");

    let details = {
      BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
      Password: Password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: PhoneNumber,
      PartyB: process.env.BUSINESS_SHORT_CODE,
      PhoneNumber: PhoneNumber,
      CallBackURL: callbackURL,
      AccountReference: process.env.ACCOUNT_REFERENCE,
      TransactionDesc: `Payment of ksh${amount}`,
    };

    const token = await getToken();
    const config = {
      headers: {
        Authorization: token,
      }, 
    };
    let {data} = await axios.post(stkInitialize, details, config)
    return data;

  } catch (error) {
    console.log(error);
  }
};

module.exports = { initiatePayment };
