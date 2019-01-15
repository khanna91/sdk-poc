module.exports = {
  API: {
    DOMAIN: 'https://middleware-service-staging.identity.astro.com.my',
    VERSION: '/api/v1',
    PROFILE: '/profile',
    LOGOUT: '/oidc/logout',
    PARTNER: '/partner'
  },
  PORTAL: {
    DOMAIN: 'https://identity-portal-stg.identity.astro.com.my',
    LINKING: '/linkAccount',
    VERIFY_SESSION: '/verify-session'
  },
  COOKIE: {
    SESSION: 'AISS',
    NONCE: 'AIN',
    AUTH_CHECK: 'AIAC'
  }
}