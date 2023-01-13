const express = require('express')
const env = require('dotenv')
env.config()
const app = express()
const {router} = require('./router/router.js')


app.listen(process.env.PORT || 3030,()=>{
    console.log('app started...');
})

app.use(express.json())
app.use('/',router)
