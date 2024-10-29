import { auth } from '@/lib/auth'
import { httpConfig } from '@/lib/config'
import { keycloakEndpoints } from '@/lib/const'
import { cookies } from 'next/headers'

export async function GET(): Promise<Response> {
    const sessionCookie = cookies().get(auth.sessionCookieName)
    if (!sessionCookie) return Response.redirect(httpConfig.frontendBaseUrl)

    const { session: session } = await auth.validateSession(sessionCookie.value)
    if (!session) return Response.redirect(httpConfig.frontendBaseUrl)

    await auth.invalidateSession(session.id)
    cookies().set(auth.createBlankSessionCookie())

    const keycloakLogoutUrl = new URL(keycloakEndpoints.logout)
    keycloakLogoutUrl.searchParams.set('post_logout_redirect_uri', '/')
    keycloakLogoutUrl.searchParams.set('id_token_hint', session.keycloakTokens.idToken)
    return Response.redirect(keycloakLogoutUrl)
}
