import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import OAuthServer from 'koa2-oauth-server';
import cors from '@koa/cors';
import LocalOAuthModel from './LocalOAuthModel';
import Database from './Databese';
import GraphQLMiddleware from './GraphQLMiddleware';

import { localOAuthClient } from '../../Config';

const app = new Koa();
const db = new Database(`${__dirname}/../../database.sqlite`);
const graphql = new GraphQLMiddleware(db);

app.use(cors());
app.use(bodyParser());

app.oauth = new OAuthServer({
  model: new LocalOAuthModel(localOAuthClient, db),
  accessTokenLifetime: 7200, // 2 hours
  refreshTokenLifetime: 1209600, // 2 weeks
});

const router = new Router();

/* OAuth2 */
const oauthRouter = new Router();

oauthRouter.post('/token', app.oauth.token());

oauthRouter.get('/', (ctx) => {
  ctx.status = 200;
  ctx.body = 'OAuth';
});

router.use('/oauth', oauthRouter.routes(), oauthRouter.allowedMethods());

/* Auth */
const authRouter = new Router();

authRouter.get('/test', (ctx) => {
  ctx.status = 200;
  ctx.body = 'test';
});

router.use(app.oauth.authenticate(), authRouter.routes(), authRouter.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());

graphql.middleware(app);

db.init()
  .then(() => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`🚀 Server ready at http://localhost:${port}`);
      console.log(`GraphQL at http://localhost:${port}${graphql.server.graphqlPath}`);
    });
  });
