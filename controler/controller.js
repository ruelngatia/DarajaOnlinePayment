const { initiatePayment } = require("../service/requestPayment")


const makePayment = (req,res)=>{
    const {phoneNumber} = req
    //logic to get the ammount to be paid. 
    try {
        initiatePayment(phoneNumber,1)? res.status(200).message({message: 'payment passed'}):res.status(400).message({message: 'payment failed'})  
    } catch (error) {
        res.status(500).message({message: 'internal sever error'})
    }
    
}

const callback =(req,res)=>{
    // data gotten from the post
}

module.exports = {makePayment, callback}