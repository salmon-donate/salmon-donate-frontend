import { keycloak } from '@/lib/auth'
import { generateCodeVerifier, generateState } from 'arctic'
import { cookies } from 'next/headers'

export async function GET(): Promise<Response> {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    const url = await keycloak.createAuthorizationURL(state, codeVerifier, {
        scopes: ['profile', 'email'],
    })

    cookies().set('keycloak_oauth_state', state, {
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        httpOnly: true,
        maxAge: 60 * 10,
    })

    cookies().set('keycloak_code_verifier', codeVerifier, {
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        httpOnly: true,
        maxAge: 60 * 10,
    })

    return Response.redirect(url)
}
