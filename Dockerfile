FROM syuchan1005/rpi-cec

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

RUN apt --no-cache add gettext nodejs \
    && chmod +x entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
