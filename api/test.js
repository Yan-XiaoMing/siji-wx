const Router = require('koa-router')
const router = new Router;

router.get('/test',(ctx,next)=>{
    ctx.body = {'test':'测试成功'}
})

module.exports =  router;