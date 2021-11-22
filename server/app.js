import Koa from 'koa'
import json from 'koa-json'
import onError from 'koa-onerror'
import logger from 'koa-logger'
import body from 'koa-body'
import Router from 'koa-router'

// KOA
const app = new Koa()
onError(app)
app.use(body({
    multipart: true
}))
app.use(json())
app.use(logger())

app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});


const routers = new Router()

// routes
import index from './routers/index.js'
routers.use(index.routes())

app.use(routers.routes(), routers.allowedMethods())

export default app