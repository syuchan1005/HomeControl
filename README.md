# React Typescript Template
## Features
- [x] React
- [x] React Router
- [x] Hot Reload (Client only)
- [x] Typescript
- [x] PWA
- [x] Linter (eslint)
- [x] GraphQL (Apollo)
- [x] [Server] Koa
- [x] [Server] watch and reload
- [x] Webpack

## How to use
1. git clone
1. Find '\_\_replace\_\_' and replace them.
  - public/index.html [title, description]
  - public/manifest.webmanifest [name, short_name]
  - package.json [name]
1. `npm install`
1. `npm run serve:client` and `npm run serve:server`

## npm scripts
### serve:client
development use.
start the client server.

### build:client
build client.
output: dist/client

### serve:server
development use.
start the server.

### build:server
build server.
output: dist/server

### serve
run serve:client and serve:server

### build
run build:client and build:server

### start
start pre-built server.

### lint
run eslint

### script:gql-gen
generate types from graphql scheme and queries

### script:generateIcon
generate icons from public/icons/icon.svg
