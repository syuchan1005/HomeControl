import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import Serve from 'koa-static';
import OAuthServer from 'koa2-oauth-server';
import cors from '@koa/cors';
import proxy from 'koa-proxy';
import logger from 'koa-logger';
import debug from 'debug';
import LocalOAuthModel from './LocalOAuthModel';
import Database from './Databese';
import GraphQLMiddleware from './GraphQLMiddleware';
import SmartHome from './SmartHome';
import Config from '../../Config';

const app = new Koa();
const db = new Database(process.env.NODE_ENV !== 'production' ? `${__dirname}/../../database.sqlite` : `${__dirname}/../../production.sqlite`);
const graphql = new GraphQLMiddleware(db);
const smartHome = new SmartHome(db);

app.use(cors());
app.use(bodyParser());
const debug1 = debug('home_control:main');
app.use(logger(str => debug1(str)));

app.oauth = new OAuthServer({
  model: new LocalOAuthModel([Config.localOAuthClient, Config.google.client], db),
  accessTokenLifetime: 7200, // 2 hours
  refreshTokenLifetime: 1209600, // 2 weeks
});

const router = new Router();

router.get('/client', (ctx) => {
  ctx.status = 200;
  ctx.body = [Config.localOAuthClient.id, Config.localOAuthClient.secret];
});

/* OAuth2 */
const oauthRouter = new Router();

oauthRouter.post('/token', app.oauth.token());

if (Config.google.enable) {
  oauthRouter.get('/google/auth/callback', app.oauth.authorize({
    allowBearerTokensInQueryString: true,
  }));
  oauthRouter.get('/google/auth', (ctx) => {
    ctx.redirect(`/?${ctx.request.querystring}#/login/google`);
  });
}

router.use('/oauth', oauthRouter.routes(), oauthRouter.allowedMethods());

/* Auth */
const authRouter = new Router();

authRouter.get('/test', (ctx) => {
  ctx.status = 200;
  ctx.body = ctx.state.oauth.token.user.username;
});

smartHome.middleware(authRouter, '/google');

router.use(app.oauth.authenticate(), authRouter.routes(), authRouter.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());

graphql.middleware(app);

if (process.env.NODE_ENV !== 'production') {
  app.use(proxy({
    host: 'http://localhost:8081',
  }));
} else {
  app.use(Serve(`${__dirname}/../`));
}

db.init()
  .then(() => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`🚀 Server ready at http://localhost:${port}`);
      console.log(`GraphQL at http://localhost:${port}${graphql.server.graphqlPath}`);
    });
  });
