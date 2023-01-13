const {Router} = require('express')
const { makePayment, callback } = require('../controler/controller')
const router = Router()


router.post('/makePayment',makePayment)
router.post('/callBack',callback)



module.exports = {router}

