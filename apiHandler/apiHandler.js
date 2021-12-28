const dao = require('../database/dao');

exports.handleApi = 
function handleApi (router) {
    router.post('/login/register', async ctx => {
        var body = ctx.request.body;
        // Check infomation integrity
        if(body.username == null || body.username == ''){
            ctx.body = {
                'errMessage': 'Username connot be empty.'
            };
            return;
        }
        if(body.email == null || body.email == ''){
            ctx.body = {
                'errMessage': 'Email connot be empty.'
            };
            return;
        }
        // Check is user exist
        [err, res] = await dao.isUserNameExist(body.username);
        if(err){
            ctx.body = {
                'errMessage': err
            };
            return;
        }
        if(res == true){
            ctx.body = {
                'errMessage': 'Username [' + body.username + '] already exists!'
            };
            return;
        }
        [err, res] = await dao.isEmailExist(body.email)
        if(err){
            ctx.body = {
                'errMessage': err
            };
            return;
        }
        if(res == true){
            ctx.body = {
                'errMessage': 'Email [' + body.email + '] already exists!'
            };
            return;
        }
        // Add user
        [err, res] = await dao.addUser({
            'username': body.username,
            'password': body.password,
            'email': body.email,
            'avatar': body.avater
        });
        ctx.body = {
            'errMessage': err,
            'result': res
        }
    })
    router.get('/users', async ctx => {
        [err, res] = await dao.getAllUsers();
        ctx.body = {
            'errMessage': err,
            'result': res
        }
    })
    router.post('/login/login', async ctx => {
        var body = ctx.request.body;
        var err, res, errMessage;
        if(+body.loginType == 0) {
            [err, res] = await dao.getUserByUsername(body.account);
        }
        else if(+body.loginType == 1) {
            [err, res] = await dao.getUserByEmail(body.account);
        }
        if(err != null){
            ctx.body = {
                'errMessage': err
            }
            return;
        }
        else if(res == null){
            ctx.body = {
                'errMessage': 'Account [' + body.account + '] does not exist.'
            }
            return;
        }
        else {
            if(res.password != body.password) {
                ctx.body = {
                    'errMessage': 'Incorrect password.'
                }
            } else {
                ctx.body = {
                    'result': res
                }
            }
        }
    })
    // 测试一下
    router.get('/', async cxt => {
        cxt.body = 'Hello Web IM Api!';
    })
    // 地址 query
    router.get('/test', async ctx => {
        ctx.body = ctx.query;
    })
    // 路由参数
    router.get('/test/:msg', async ctx => {
        ctx.body = ctx.params;
    })
    // POST body
    router.post('/test', async ctx => {
        ctx.body = ctx.request.body;
    })
}