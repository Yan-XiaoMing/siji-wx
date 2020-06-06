const {
    parseString
} = require('xml2js');
const {
    resolve
} = require('path');
const {
    writeFile,
    readFile
} = require('fs');
module.exports = {
    getUserDataAsync(req) {
        return new Promise((resolve, reject) => {
            let xmlData = '';
            req.on('data', data => {
                // console.log(data);
                //数据为buffer,转化为字符串接收
                xmlData += data.toString();
            }).on('end', () => {
                resolve(xmlData);
            })
        })

    },

    parseXMLAsync(xmlData) {
        return new Promise((resolve, reject) => {
            parseString(xmlData, {
                trim: true
            }, (err, data) => {
                if (!err) {
                    resolve(data);
                } else {
                    reject('parseXMLAsync,error：' + err);
                }
            })
        })
    },

    formatMessage (jsData) {
        let message = {};
        jsData = jsData.xml;
        if (typeof jsData === 'object') {
          for (let key in jsData) {
            let value = jsData[key];
            if (Array.isArray(value) && value.length > 0) {
              message[key] = value[0];
            }
          }
        
        }
        return message;
      },
    writeFileAsync(data, fileName) {
        //将对象转化json字符串
        data = JSON.stringify(data);
        const filePath = resolve(__dirname, fileName);
        return new Promise((resolve, reject) => {
            writeFile(filePath, data, err => {
                if (!err) {
                    console.log('文件保存成功');
                    resolve();
                } else {
                    reject('writeFileAsync方法出了问题:' + err);
                }
            })
        })
    },
    readFileAsync(fileName) {
        const filePath = resolve(__dirname, fileName);
        return new Promise((resolve, reject) => {
            readFile(filePath, (err, data) => {
                if (!err) {
                    console.log('文件读取成功');
                    //将json字符串转化js对象
                    data = JSON.parse(data);
                    resolve(data);
                } else {
                    reject('readFileAsync方法出了问题：' + err);
                }
            })
        })
    }
}