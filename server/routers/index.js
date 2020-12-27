const controllers = require('./registry');
const chalk = require('chalk');
const APIVER = '/v1'

module.exports = (router) => {
    router.get(APIVER + '/health', async ( ctx )=>{
        ctx.body = {status:'OK'}
    })

    controllers.forEach((Controller) =>{
        new Controller().routers().forEach(r=>{
            console.log(`register router: ${chalk.blue.bgYellow('['+r.method+']')} ${chalk.yellow((APIVER + r.path))}`)
            if (r.method === 'GET') {
                router.get(APIVER + r.path, async (ctx) => {
                    return r.func(ctx);
                })
            } else {
                router.post(APIVER +r.path, async (ctx) => {
                    return r.func(ctx);
                })
            }
        })
    })

}