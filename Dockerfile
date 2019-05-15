FROM node:11-alpine

LABEL maintainer="syuchan1005<syuchan.dev@gmail.com>"
LABEL name="HomeControl"

COPY ./ /home_control/

WORKDIR /home_control

ENV localOAuthId="home_control_local" \
    localOAuthSecret="home_control_local_secret" \
    googleOAuthEnable="false" \
    googleOAuthId="home_control_google" \
    googleOAuthSecret="home_control_google_secret" \
    googleRedirectBaseUrl="https://oauth-redirect.googleusercontent.com/r/" \
    googleProjectId=""

RUN apk --no-cache add gettext python git \
    && chmod +x entrypoint.sh

ENTRYPOINT ["/home_control/entrypoint.sh"]
