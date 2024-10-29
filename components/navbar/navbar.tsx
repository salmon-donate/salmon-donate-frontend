import React from 'react'

import Link from 'next/link'
import AuthSidebar from './auth-sidebar'
import { Fish } from 'lucide-react'
import { decodeKeycloakJwt } from '@/lib/utils'
import { getServerKeycloakAccessToken } from '@/lib/session'
import { runAxiosWithErrorHandling, userApi } from '@/lib/api'
import NotAuthBar from './not-auth-sidebar'

export default async function Navbar() {
    const token = decodeKeycloakJwt(await getServerKeycloakAccessToken())
    const profileData = token ? await runAxiosWithErrorHandling(async () => (await userApi.apiV1UserProfileGet()).data) : null

    return (
        <header className="px-4 py-4 flex items-center justify-between border-b">
            <Link href="/" className="flex items-center space-x-2">
                <Fish className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold text-primary">Salmon Donate</span>
            </Link>
            {token && profileData ? (
                <AuthSidebar name={token.name} email={token.email} username={token.preferred_username} avatarUrl={profileData.avatarUrl} />
            ) : (
                <NotAuthBar />
            )}
        </header>
    )
}
