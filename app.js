const Koa = require('koa');
const parser = require('koa-bodyparser');
const catchError = require('./middlewares/exception')
const auth = require('./wechat/auth');
const InitManager = require('./core/init');

const app =new Koa();

InitManager.initCore(app);
app.use(parser());
app.use(catchError);
app.use(auth())




app.listen(9910,()=>{
    console.log('localhost://9910');
})