import { Session, User } from 'lucia'
import { cookies } from 'next/headers'
import { auth, keycloak } from './auth'
import { calcDatesDifferenceInSec, decodeKeycloakJwt } from './utils'
import { frontendEndpoints } from './const'
import { redirect } from 'next/navigation'
import { OAuth2RequestError } from 'arctic'

const TOKEN_EXPIRATION_THRESHOLD = 30

export async function getServerSession() {
    const { session: session } = await validateRequest()

    return session
}

export async function getServerKeycloakAccessToken(withAccessTokenRefresh: boolean = false) {
    const session = await getServerSession()
    if (!session) return null

    const decodedToken = decodeKeycloakJwt(session.keycloakTokens.accessToken)
    if (!decodedToken?.exp) redirect(frontendEndpoints.errors.error_500)

    if (calcDatesDifferenceInSec(session.keycloakTokens.accessTokenExpiresAt, new Date()) >= TOKEN_EXPIRATION_THRESHOLD && !withAccessTokenRefresh)
        return session.keycloakTokens.accessToken

    if (
        session.keycloakTokens.refreshTokenExpiresAt &&
        calcDatesDifferenceInSec(session.keycloakTokens.refreshTokenExpiresAt, new Date()) <= TOKEN_EXPIRATION_THRESHOLD
    ) {
        await auth.invalidateSession(session.id)
        redirect(frontendEndpoints.auth.signIn.keycloak)
    } else if (!session.keycloakTokens.refreshToken) redirect(frontendEndpoints.errors.error_500)

    try {
        const refreshedTokens = await keycloak.refreshAccessToken(session.keycloakTokens.refreshToken)
        const updatedSession = await auth.createSession(session.userId, { keycloakTokens: refreshedTokens }, { sessionId: session.id })

        return updatedSession.keycloakTokens.accessToken
    } catch (err) {
        console.log(err)

        if (err instanceof OAuth2RequestError) {
            await auth.invalidateSession(session.id)
            redirect(frontendEndpoints.auth.signIn.keycloak)
        }
        redirect(frontendEndpoints.errors.error_500)
    }
}

export async function validateRequest(): Promise<{ user: User; session: Session } | { user: null; session: null }> {
    const sessionId = cookies().get(auth.sessionCookieName)?.value ?? null
    if (!sessionId) {
        return {
            user: null,
            session: null,
        }
    }

    const result = await auth.validateSession(sessionId)

    try {
        if (result.session && result.session.fresh) {
            const sessionCookie = auth.createSessionCookie(result.session.id)
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
        }
        if (!result.session) {
            const sessionCookie = auth.createBlankSessionCookie()
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
        }
    } catch {}

    return result
}
