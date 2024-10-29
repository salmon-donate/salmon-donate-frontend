import { KeycloakTokens } from 'arctic'

declare module 'lucia' {
    interface Session {
        keycloakTokens: KeycloakTokens
    }

    interface Register {
        Lucia: typeof lucia
        DatabaseSessionAttributes: DatabaseSessionAttributes
    }
}

interface DatabaseSessionAttributes {
    keycloakTokens: KeycloakTokens
}
