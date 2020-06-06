const {
    HttpException
} = require('../core/http-exception')

const catchError = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        const isHttpException = err instanceof HttpException;

        if (isHttpException) {
            ctx.body = {
                msg: err.msg,
                errorCode: err.errorCode,
                request: `${ctx.method} ${ctx.path}`
            };
            ctx.status = err.status;
        } else {
            ctx.body = {
                msg: '服务器未知异常',
                errorCode: '666',
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = 500
        }
    }
}

module.exports = catchError;