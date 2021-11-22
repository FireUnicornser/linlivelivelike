import Router from 'koa-router'
import spawn from 'child_process'
import fs from 'fs'

const router = new Router()
const upload = spawn.spawn

router.prefix('/')
var login = upload('./aliyunpan-v0.0.6-linux-amd64/aliyunpan', ['login', '-RefreshToken=token'])

login.stdout.on('data', function (data) {
    console.log('standard output:\n' + data);
});
login.stderr.on('data', function (data) {
    console.log('standard error output:\n' + data);
});
login.on('exit', function (code, signal) {
    console.log('child process eixt ,exit:' + code);
});

setInterval(function () {
    var token = upload('./aliyunpan-v0.0.6-linux-amd64/aliyunpan', ['token', 'update'])
    token.stdout.on('data', function (data) {
        console.log('standard output:\n' + data);
    });
    token.stderr.on('data', function (data) {
        console.log('standard error output:\n' + data);
    });
    token.on('exit', function (code, signal) {
        console.log('child process eixt ,exit:' + code);
    });
}, 1000 * 60)


router.post('/', async ctx => {
    if (ctx.request.body.EventType == 'SessionStarted') {
        let upName = ctx.request.body.EventData.Name
        console.log(`${upName}开播啦！`)
    }
    if (ctx.request.body.EventType == 'FileClosed') {
        let filePath = ctx.request.body.EventData.RelativePath
        let upName = ctx.request.body.EventData.Name
        console.log('切片结束')
        console.log(`文件地址:${filePath}`)
        console.log(`UP名字：${upName}`)
        var hand = upload('./aliyunpan-v0.0.6-linux-amd64/aliyunpan', ['u', `/rec/${filePath}`, `/${upName}`])
        hand.stdout.on('data', function (data) {
            console.log('standard output:\n' + data);
        });
        hand.stderr.on('data', function (data) {
            console.log('standard error output:\n' + data);
        });
        hand.on('exit', function (code, signal) {
            if (code == 0) {
                fs.unlinkSync(`/rec/${filePath}`);
                console.log(`删除文件:/rec/${filePath}`);
            }
            console.log('child process eixt ,exit:' + code);
        });
    }
    ctx.body = 'done'

})

export default router


