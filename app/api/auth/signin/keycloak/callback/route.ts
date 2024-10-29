import jwt from 'jsonwebtoken'

import { auth, keycloak } from '@/lib/auth'
import { OAuth2RequestError } from 'arctic'
import { cookies } from 'next/headers'
import { httpConfig } from '@/lib/config'

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const storedState = cookies().get('keycloak_oauth_state')?.value ?? null
    const codeVerifier = cookies().get('keycloak_code_verifier')?.value ?? null

    if (!code || !state || !storedState || state !== storedState || !codeVerifier) return new Response(null, { status: 400 })

    try {
        const tokens = await keycloak.validateAuthorizationCode(code, codeVerifier)

        const decodedAccessToken = jwt.decode(tokens.accessToken, {
            json: true,
        })
        if (!decodedAccessToken || !decodedAccessToken.sub) throw Error('Invalid access token')

        const session = await auth.createSession(decodedAccessToken.sub, {
            keycloakTokens: tokens,
        })
        cookies().set(auth.createSessionCookie(session.id))

        return Response.redirect(httpConfig.frontendBaseUrl)
    } catch (err) {
        console.log(err)

        if (err instanceof OAuth2RequestError) return new Response(null, { status: 400 })

        return new Response(null, { status: 500 })
    }
}
