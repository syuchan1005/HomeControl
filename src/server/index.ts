import Koa from 'koa';
import Serve from 'koa-static';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';

import GraphQL from './graphql';
import sequelize from './database/model';

const app = new Koa();
const graphql = new GraphQL();

if (process.env.NODE_ENV === 'production') {
  app.use(Serve('dist/client'));
}

(async () => {
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
