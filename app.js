const express = require('express');
const auth = require('./wechat/auth');

const app = express();


app.use(auth())




app.listen(9910,()=>{
    console.log('localhost://9910');
})