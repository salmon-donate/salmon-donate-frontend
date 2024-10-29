import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { decodeKeycloakJwt } from '@/lib/utils'
import { getServerKeycloakAccessToken } from '@/lib/session'
import { redirect, RedirectType } from 'next/navigation'
import { frontendEndpoints, keycloakEndpoints } from '@/lib/const'
import { keycloakConfig } from '@/lib/config'
import { randomUUID } from 'crypto'

export default async function SecuritySettingsPage() {
    const token = decodeKeycloakJwt(await getServerKeycloakAccessToken(true))
    if (!token) redirect(frontendEndpoints.errors.error_401, RedirectType.replace)

    async function changeEmailHandler() {
        'use server'
        const url = new URL(keycloakEndpoints.authorization)
        url.searchParams.append('client_id', keycloakConfig.clientId)
        url.searchParams.append('redirect_uri', '/settings/security')
        url.searchParams.append('response_type', 'code')
        url.searchParams.append('scope', 'openid')
        url.searchParams.append('state', randomUUID())
        url.searchParams.append('nonce', randomUUID())
        url.searchParams.append('kc_action', 'UPDATE_EMAIL')

        redirect(url.toString())
    }

    async function changePasswordHandler() {
        'use server'
        const url = new URL(keycloakEndpoints.authorization)
        url.searchParams.append('client_id', keycloakConfig.clientId)
        url.searchParams.append('redirect_uri', '/settings/security')
        url.searchParams.append('response_type', 'code')
        url.searchParams.append('scope', 'openid')
        url.searchParams.append('state', randomUUID())
        url.searchParams.append('nonce', randomUUID())
        url.searchParams.append('kc_action', 'UPDATE_PASSWORD')

        redirect(url.toString())
    }

    async function changeTOTPHandler() {
        'use server'
        const url = new URL(keycloakEndpoints.authorization)
        url.searchParams.append('client_id', keycloakConfig.clientId)
        url.searchParams.append('redirect_uri', '/settings/security')
        url.searchParams.append('response_type', 'code')
        url.searchParams.append('scope', 'openid')
        url.searchParams.append('state', randomUUID())
        url.searchParams.append('nonce', randomUUID())
        url.searchParams.append('kc_action', 'CONFIGURE_TOTP')

        redirect(url.toString())
    }

    return (
        <div className="py-6 lg:py-10">
            <div className="space-y-6 lg:max-w-4xl">
                <div className="max-lg:px-4">
                    <h3 className="text-lg font-medium">Account security</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your security settings, including your email, password, and Two-Factor Authentication (TOTP).
                    </p>
                </div>
                <Separator />
                <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <div>
                            <h4 className="font-medium max-lg:px-2">Email</h4>
                            <Separator />
                        </div>
                        <form action={changeEmailHandler}>
                            <div className="flex flex-col gap-2 max-lg:px-2">
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="email">Your Email</Label>
                                    <Input readOnly id="email" type="email" defaultValue={token.email || 'null'} />
                                </div>
                                <Button className="max-w-min" type="submit">
                                    Change Email
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div>
                            <h4 className="font-medium max-lg:px-2">Password</h4>
                            <Separator />
                        </div>
                        <form action={changePasswordHandler}>
                            <div className="flex flex-col gap-2 max-lg:px-2">
                                <Button className="max-w-min" type="submit">
                                    Change Password
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div>
                            <h4 className="font-medium max-lg:px-4">TOTP</h4>
                            <Separator />
                        </div>
                        <form action={changeTOTPHandler}>
                            <div className="flex flex-col gap-2 max-lg:px-2">
                                <Button className="max-w-min" type="submit">
                                    Change TOTP
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
