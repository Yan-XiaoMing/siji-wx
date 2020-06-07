const config = require('../config/index');
const sha1 = require('sha1');

const {
    getUserDataAsync,
    parseXMLAsync,
    formatMessage
} = require('../utils/tool');

const template = require('./template');

const reply =  require('./reply');

module.exports = () => {
    return async (req, res, next) => {

        const {signature, echostr, timestamp, nonce} = req.query;
        const {token} = config;

        const str = [token, timestamp, nonce].sort().join('');

        const sha = sha1(str);

        if (req.method === 'GET') {
            if (sha === signature) {
                res.send(echostr);
                console.log('接口配置信息:success');
            } else {
                console.log('error')
                res.send("接口配置信息:error");
            }
        } else if (req.method === 'POST') {
            if (sha !== signature) {
                //如果不是微信服务来的不处理
                res.end('error');
            }
            // console.log(req.query);
            const xmlData = await getUserDataAsync(req);
            // console.log(xmlData);
            /* 
                <xml>
                    <ToUserName><![CDATA[gh_64237af7fa85]]></ToUserName>  开发者id
                    <FromUserName><![CDATA[oCBsTuFW0nwtmtKbc1-fe88QV-60]]></FromUserName> 用户openid
                    <CreateTime>1587119365</CreateTime> 发送时间戳
                    <MsgType><![CDATA[text]]></MsgType> 发送的消息类型
                    <Content><![CDATA[1]]></Content> 发送的内容
                    <MsgId>22722085254785981</MsgId> 消息id,微信用户服务器自动保存的数据(3天),通过该id可查找用户数据
                </xml> 
            */

            //解析xml为object

            const jsData = await parseXMLAsync(xmlData);

            // console.log(jsData);
            /*
            {
                xml: {
                    ToUserName: [ 'gh_64237af7fa85' ],
                    FromUserName: [ 'oCBsTuFW0nwtmtKbc1-fe88QV-60' ],
                    CreateTime: [ '1587175934' ],
                    MsgType: [ 'text' ],
                    Content: [ '1' ],
                    MsgId: [ '22722897558728017' ]
                }
            }
            */
            console.log(jsData);
            //去除xml中的冗余数据，并重新格式化
            const message = formatMessage(jsData);

            const options = reply(message);

            //回复用户消息
            const replyMessage = template(options);
            console.log(replyMessage);

            res.send(replyMessage);
            // ctx.end('');
        } else {
            res.end('error')
        }

    }
}