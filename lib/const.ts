import { CoinType } from '@/generated/backend-client'
import { keycloakConfig } from './config'

export const keycloakEndpoints = {
    authorization: keycloakConfig.issuer + '/protocol/openid-connect/auth',
    token: keycloakConfig.issuer + '/protocol/openid-connect/token',
    introspection: keycloakConfig.issuer + '/protocol/openid-connect/token/introspect',
    userinfo: keycloakConfig.issuer + '/protocol/openid-connect/userinfo',
    logout: keycloakConfig.issuer + '/protocol/openid-connect/logout',
} as const

export const frontendEndpoints = {
    auth: {
        signIn: {
            keycloak: '/api/auth/signin/keycloak',
        },
        signOut: {
            keycloak: '/api/auth/signout/keycloak',
        },
    },
    errors: {
        error_400: '/errors/400',
        error_401: '/errors/401',
        error_403: '/errors/403',
        error_500: '/errors/500',
    },
} as const

export const cryptoList = new Map<CoinType, string>([
    [CoinType.Xmr, 'Monero'],
    [CoinType.Btc, 'Bitcoin'],
    [CoinType.Ltc, 'Litecoin'],
    [CoinType.Eth, 'Ethereum'],
    [CoinType.Ton, 'Toncoin'],
])
