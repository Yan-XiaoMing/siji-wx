//access_token 微信调用全局接口唯一凭据
//唯一、2小时过期

//请求地址
//https请求方式: GET https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET

const rp = require('request-promise-native');

const {
    writeFile,
    readFile
} = require('fs')

const {
    appID,
    appsecret
} = require('../config');

const menu = require('./menu');


class Wechat {
    getAccessToken() {
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`

        /*
            request-promise-native
            返回值promis
        */
        return new Promise((resolve, reject) => {
            rp({
                    method: 'GET',
                    url,
                    json: true
                })
                .then(res => {
                    console.log(res);
                    //设置过期时间 提前5min过期确保有效
                    res.expires_in = Date.now() + (res.expires_in - 5 * 60) * 1000;
                    resolve(res);
                }).catch(err => {
                    console.log('getAccessToken出现错误: ' + err);
                    reject('getAccessToken出现错误: ' + err)
                })
        })
    }

    saveAccessToken(accessToken) {
        accessToken = JSON.stringify(accessToken);
        return new Promise((resolve, reject) => {
            writeFile('./accessToken.txt', accessToken, err => {
                if (!err) {
                    console.log('文件保存成功')
                    resolve('');
                } else {
                    console.log('accessToken文件保存失败')
                    reject('accessToken文件保存失败' + err);
                }
            })
        })
    }

    readAccessToken() {
        return new Promise((resolve, reject) => {
            readFile('./accessToken.txt', (err, data) => {
                if (!err) {
                    console.log('accessToken读取成功')
                    data = JSON.parse(data);
                    resolve(data);
                } else {
                    console.log('accessToken文件读取失败');
                    reject('accessToken文件读取失败' + err);
                }
            })
        })
    }

    isValidAccessToken(data) {
        //检测传入参数是否有效
        if (!data && !data.access_token && !data.expires_in) {
            return false;
        }

        //检测token是否在有效期
        if (data.expires_in < Date.now()) {
            return false;
        } else {
            return true;
        }
    }

    fetchAccessToken() {
        //优化操作,优化不去执行读取文件操作
        if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
            //说明this有凭据和过期时间，并且凭据未过期
            return Promise.resolve({
                access_token: this.access_token,
                expires_in: this.expires_in
            });
        }

        return this.readAccessToken()
            .then(async res => {
                //判断凭据是否过期(isValidAccessToken)
                if (this.isValidAccessToken(res)) {
                    //没有过期，直接使用
                    return Promise.resolve(res);
                } else {
                    //重新发送请求获取凭据
                    const data = await this.getAccessToken();
                    //保存下来
                    await this.saveAccessToken(data);
                    //将请求回来的凭据返回出去
                    return Promise.resolve(data);
                }
            })
            .catch(async err => {
                console.log(err);
                //重新发送请求获取凭据
                const data = await this.getAccessToken();
                //保存下来
                await this.saveAccessToken(data);
                //将请求回来的凭据返回出去
                return Promise.resolve(data);
            })
            .then(res => {
                //将其请求回来的凭据和过期时间挂载到this上
                this.access_token = res.access_token;
                this.expires_in = res.expires_in;
                //指定fetchAccessToken方法返回值
                return Promise.resolve(res);
            })
    }

    createMenu(menu) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.fetchAccessToken();

                const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`

                const result = await rp({
                    method: 'POST',
                    url,
                    json: true,
                    body: menu
                });

                resolve(result);

            } catch (error) {
                reject('createMenu异常:' + error);
            }

        })
    }

    deleteMenu() {
        return new Promise(async (resolve, reject) => {

            try {
                const data = await this.fetchAccessToken();

                const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`

                const result = await rp({
                    method: 'GET',
                    url,
                    json: true
                });

                resolve(result);
            } catch (error) {
                reject('deleteMenu异常:' + error);
            }

        })
    }

    getTicket() {

        //发送请求
        return new Promise(async (resolve, reject) => {
            //获取access_token
            const data = await this.fetchAccessToken();
            //定义请求的地址
            const url = `${api.ticket}&access_token=${data.access_token}`;

            rp({
                    method: 'GET',
                    url,
                    json: true
                })
                .then(res => {
                    //将promise对象状态改成成功的状态
                    resolve({
                        ticket: res.ticket,
                        expires_in: Date.now() + (res.expires_in - 300) * 1000
                    });
                })
                .catch(err => {
                    console.log(err);
                    //将promise对象状态改成失败的状态
                    reject('getTicket方法出了问题：' + err);
                })
        })
    }


    saveTicket(ticket) {
        return writeFileAsync(ticket, 'ticket.txt');
    }


    readTicket() {
        return readFileAsync('ticket.txt');
    }


    isValidTicket(data) {
        //检测传入的参数是否是有效的
        if (!data && !data.ticket && !data.expires_in) {
            //代表ticket无效的
            return false;
        }

        return data.expires_in > Date.now();
    }


    fetchTicket() {
        //优化
        if (this.ticket && this.ticket_expires_in && this.isValidTicket(this)) {
            //说明之前保存过ticket，并且它是有效的, 直接使用
            return Promise.resolve({
                ticket: this.ticket,
                expires_in: this.ticket_expires_in
            })
        }

        return this.readTicket()
            .then(async res => {
                //本地有文件
                //判断它是否过期
                if (this.isValidTicket(res)) {
                    //有效的
                    return Promise.resolve(res);
                } else {
                    //过期了
                    const res = await this.getTicket();
                    await this.saveTicket(res);
                    return Promise.resolve(res);
                }
            })
            .catch(async err => {
                //本地没有文件
                const res = await this.getTicket();
                await this.saveTicket(res);
                return Promise.resolve(res);
            })
            .then(res => {
                //将ticket挂载到this上
                this.ticket = res.ticket;
                this.ticket_expires_in = res.expires_in;
                //返回res包装了一层promise对象（此对象为成功的状态）
                return Promise.resolve(res);
            })
    }
}

    (async () => {
        const w = new Wechat();

        let result = await w.deleteMenu();
        console.log(result);

        result = await w.createMenu(menu);
        console.log(result);

    })()
    // W.getAccessToken();


    // w.readAccessToken()
    //     .then(res=>{
    //         if(W.isValidAccessToken(res)){
    //             resolve(res);
    //         }
    //         else{

    //         }
    //     })
    //     .catch(err=>{
    //         w.getAccessToken()
    //             .then(res=>{

    //                 w.saveAccessToken(res)
    //             })
    //     })