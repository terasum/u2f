const controllers = require('./registry')
const chalk = require('chalk')
const APIVER = '/v1'

function ctxWrapper(func) {
  return async function (ctx) {
    let req = {
      body: ctx.request.body,
      query: ctx.request.query,
    }
    console.log(`${chalk.blue.bgYellow('KOA| request :')} [${ctx.method}](${ctx.href})`);
    let result =  await func(req);
    console.log(`${chalk.blue.bgYellow('KOA| response:')} [${ctx.method}](${ctx.href})| `,result);
    ctx.body = result;
  }
}

module.exports = (router) => {
  router.get(APIVER + '/health', async (ctx) => {
    ctx.body = { status: 'OK' }
  })

  controllers.forEach((Controller) => {
    new Controller().routers().forEach((r) => {
      console.log(
        `register router: ${chalk.blue.bgYellow(
          '[' + r.method + ']',
        )} ${chalk.yellow(APIVER + r.path)}`,
      )
      if (r.method === 'GET') {
        router.get(APIVER + r.path, async (ctx) => {
          return ctxWrapper(r.func)(ctx);
        })
      } else {
        router.post(APIVER + r.path, async (ctx) => {
          return ctxWrapper(r.func)(ctx);
        })
      }
    })
  })
}
