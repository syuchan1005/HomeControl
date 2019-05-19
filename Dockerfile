FROM node:11-alpine AS build

COPY . /build

WORKDIR /build

RUN apk add --no-cache git python build-base \
    && cd client && npm ci \
    && cd ../server && npm ci \
    && cd .. && npm ci && npm run build:docker

FROM node:11-alpine

LABEL maintainer="syuchan1005<syuchan.dev@gmail.com>"
LABEL name="HomeControl"

COPY --from=build /build/client/dist /home_control/client
COPY --from=build /build/server/dist /home_control/server
COPY --from=build /build/server/package.json /home_control
COPY --from=build /build/server/package-lock.json /home_control

COPY ./entrypoint.sh /home_control

WORKDIR /home_control

ENV localOAuthId="home_control_local" \
    localOAuthSecret="home_control_local_secret" \
    googleOAuthEnable="false" \
    googleOAuthId="home_control_google" \
    googleOAuthSecret="home_control_google_secret" \
    googleRedirectBaseUrl="https://oauth-redirect.googleusercontent.com/r/" \
    googleProjectId=""

RUN apk --no-cache add python git build-base \
    && chmod +x entrypoint.sh \
    && npm ci --only=production \
    && apk --no-cache del python git build-base

ENTRYPOINT ["/home_control/entrypoint.sh"]
