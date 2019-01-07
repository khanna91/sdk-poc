module.exports = {
  API: {
    DOMAIN: 'https://middleware-service-develop.identity.astro.com.my',
    VERSION: '/api/v1',
    PROFILE: '/profile',
    LOGOUT: '/oidc/logout',
    PARTNER: '/partner'
  },
  PORTAL: {
    DOMAIN: 'https://identity-portal-dev.identity.astro.com.my',
    LINKING: '/linkAccount'
  },
  COOKIE: {
    SESSION: 'AISS',
    NONCE: 'AIN',
    AUTH_CHECK: 'AIAC'
  }
}