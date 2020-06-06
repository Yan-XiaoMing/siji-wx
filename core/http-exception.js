class HttpException extends Error{
    constructor(msg='服务器异常',status = 400,errorCode = 4000){
        super();
        this.errorCode = errorCode;
        this.status = status;
        this.msg = msg;
    }
}




module.exports={
    HttpException
}