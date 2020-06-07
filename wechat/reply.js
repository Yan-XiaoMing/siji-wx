/**
 * 处理用户发送的消息和内容,决定返回不同内容给用户
 */

module.exports = message =>{

    // console.log(message);

    let options = {
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName,
        createTime : Date.now(),
        msgType:'text'
    }
    
    //判断用户发送的消息是否为文本消息
    let content = '唔~不好意思,小惠没听懂你在说什么';
    if(message.MsgType === 'text'){
        //判断用户消息内容
        if(message.Content === '1'){
            content = '四季惠享,欢迎您的加入!'
        }else if(message.Content === '2'){
            content = '四季惠享,给你更多快乐!'
        }else if(message.Content.match('爱')){
            content = '四季惠享,我们都爱';
        }
    }
    else if(message.MsgType === 'image'){
        options.msgType = 'image';
        options.mediaId = message.MediaId;
        console.log(message.PicUrl);
    }
    else if(message.MsgType === 'voice'){
        options.msgType = 'voice';
        options.mediaId = message.MediaId;
        console.log("用户说了:"+message.Recognition);
    }
    else if(message.MsgType === 'location'){
        content = `纬度:${message.Location_X} 经度:${message.Location_Y} 位置信息:${message.Label}`;
    }
    else if (message.MsgType === 'event'){
        if(message.Event === 'subscribe'){
            //用户订阅
            content = '四季惠享,欢迎您的关注~'
            if(message.EventKey){
                //用户扫描了带参二维码关注
                content = '四季惠享,欢迎您的扫码关注~'
            }
        }
        else if(message.Event === 'unsubscribe'){
            //用户取关
            console.log('用户取关')
        }
        else if(message.Event === 'SCAN'){
            //已关注的用户再次扫描了带参二维码关注
            content = '谢谢你这么喜欢,四季惠享,你已经成功关注过啦~'
        }
        else if(message.Event === 'CLICK'){
            //用户点击了菜单按钮
            // content = '菜单中的更多内容敬请期待哦~'
            content = `点击按钮:${message.EventKey}`;
        }

    }

    options.content = content;

    console.log(options);

    return options;
}