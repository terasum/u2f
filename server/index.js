const Koa = require('koa');
const Router = require('koa-router');
const routers = require('./routers');

const isProd = process.env.NODE_ENV === 'production';

const app = new Koa();

let router = new Router();
routers(router);

app.use(router.routes()).use(router.allowedMethods())

if (isProd) {
  require('./utils/setup-prod.js')(app);
} else {
  require('./utils/setup-dev.js')(app);
}


app.listen(process.env.PORT || 3000);