const requireDirectory = require('require-directory');
const Router = require('koa-router');

class InitManager {

    static initCore(app) {
        InitManager.app = app;

    }

    static loadConfig(path = '') {
        const configPath = path || process.cwd() + '/config/index.js';
        const config = require(configPath);
        global.config = config;
    }

    static initLoadRouters() {
        requireDirectory = (module, '../api', {
            visit: whenLoadModule
        })

        function whenLoadModule(obj) {
            if (obj instanceof Router) {
                InitManager.app.use(obj.routes())
            }
        }
    }

    static loadHttpException(){
        const errors = require('./http-exception');
        global.errors = errors;
    }

}

module.exports = InitManager;