module.exports = {
  localOAuthClient: {
    id: '$localOAuthId',
    secret: '$localOAuthSecret',
    grants: ['password', 'refresh_token'],
  },
  google: {
    enable: $googleOAuthEnable,
    client: {
      id: '$googleOAuthId',
      secret: '$googleOAuthSecret',
      grants: ['authorization_code', 'refresh_token'],
      redirectUris: [
        '${googleRedirectBaseUrl}${googleProjectId}',
      ],
    },
  },
};
