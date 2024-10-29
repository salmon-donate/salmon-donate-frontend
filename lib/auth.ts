import { Lucia } from 'lucia'
import { Keycloak } from 'arctic'
import { BasicSessionRedisAdapter } from './redis-adapter'
import { JwtPayload } from 'jsonwebtoken'
import { createClient } from 'redis'
import { keycloakConfig, redisConfig } from './config'

const redisClient = createClient({
    url: `redis://${redisConfig.host}:${redisConfig.port}`,
})
await redisClient.connect()

export const adapter = new BasicSessionRedisAdapter(redisClient)
export const auth = new Lucia(adapter, {
    getSessionAttributes: (attributes) => {
        return {
            keycloakTokens: attributes.keycloakTokens,
        }
    },
})
export type Auth = typeof auth

export const keycloak = new Keycloak(
    keycloakConfig.issuer,
    keycloakConfig.clientId,
    keycloakConfig.clientSecret,
    '/api/auth/signin/keycloak/callback'
)
export interface KeycloakJWT extends JwtPayload {
    auth_time?: number
    typ?: string
    azp?: string
    session_state?: string
    acr?: string
    sid?: string
    email_verified?: boolean
    name?: string
    preferred_username?: string
    given_name?: string
    family_name?: string
    email?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: any
}
