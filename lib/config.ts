import { getEnvOrThrow } from './utils'

export const keycloakConfig = {
    issuer: getEnvOrThrow('SD_KEYCLOAK_ISSUER'),
    clientId: getEnvOrThrow('SD_KEYCLOAK_CLIENT_ID'),
    clientSecret: getEnvOrThrow('SD_KEYCLOAK_CLIENT_SECRET'),
} as const

export const redisConfig = {
    host: getEnvOrThrow('SD_FRONTEND_REDIS_HOST'),
    port: getEnvOrThrow('SD_FRONTEND_REDIS_PORT'),
} as const

export const httpConfig = {
    frontendBaseUrl: getEnvOrThrow('SD_FRONTEND_BASE_URL'),
    backendBaseUrl: getEnvOrThrow('SD_BACKEND_BASE_URL'),
} as const
