import Koa from 'koa';
import Serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';
import OAuthServer from 'koa2-oauth-server';
import { ServerOptions } from 'oauth2-server';

import GraphQL from '@server/graphql';
import sequelize from '@server/database/model';
import SmartHome from '@server/google/SmartHome';
import { LocalOAuthModel } from '@server/google/LocalOAuthModel';
import { getConfig } from '../common/Config';

(async () => {
  const config = await getConfig();

  const app = new Koa();
  const graphql = new GraphQL();
  const smartHome = new SmartHome();

  app.use(bodyParser());

  // @ts-ignore
  const oauthServer = new OAuthServer({
    model: new LocalOAuthModel([
      {
        id: config.googleClient.id,
        secret: config.googleClient.secret,
        grants: ['authorization_code', 'refresh_token'],
        redirectUris: config.googleClient.redirectUris,
      },
    ]),
    accessTokenLifetime: 7200, // 2 hours
    refreshTokenLifetime: 1209600, // 2 weeks
  } as ServerOptions);

  const router = new Router();

  /* OAuth2 */
  const oauthRouter = new Router();

  oauthRouter.get('/client', (ctx) => {
    ctx.body = { id: config.googleClient.id };
  });

  oauthRouter.post('/token', oauthServer.token());

  oauthRouter.get('/google/auth/callback', oauthServer.authorize({
    allowBearerTokensInQueryString: true,
  }));

  router.use('/oauth', oauthRouter.routes(), oauthRouter.allowedMethods());

  /* Auth */
  const authRouter = new Router();

  authRouter.get('/test', (ctx) => {
    ctx.status = 200;
    ctx.body = ctx.state.oauth.token.user.username;
  });

  smartHome.middleware(authRouter, '/google_actions');

  router.use(oauthServer.authenticate(), authRouter.routes(), authRouter.allowedMethods());

  app.use(router.routes());
  app.use(router.allowedMethods());


  if (process.env.NODE_ENV === 'production') {
    app.use(Serve('dist/client'));
  }

  await sequelize.sync();
  await graphql.middleware(app);

  app.use(historyApiFallback({}));

  const port = process.env.PORT || 8081;
  const server = app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`👔 listen  at: http://localhost:${port}`);
    console.log(`🚀 graphql at: http://localhost:${port}${graphql.server.graphqlPath}`);
  });

  graphql.useSubscription(server);
})();
