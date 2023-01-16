const { initiatePayment } = require("../service/requestPayment")


const makePayment = async (req,res)=>{
    // const {phoneNumber} = req
    let phoneNumber = '254718432590'
    let amount = 1

    //logic to get the ammount to be paid. 
    try {
        const response = await initiatePayment(phoneNumber,amount)
        response?.ResponseCode == '0'? res.status(200).json({message: 'payment passed'}):res.status(400).json({message: 'payment failed'})        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'internal sever error'})
    }
    
}

const callback =(req,res)=>{
    // data gotten from the post
}

module.exports = {makePayment, callback}