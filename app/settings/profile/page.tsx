import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { runAxiosWithErrorHandling, userApi } from '@/lib/api'
import { frontendEndpoints } from '@/lib/const'
import { getServerKeycloakAccessToken } from '@/lib/session'

import { AvatarFalbackGen, decodeKeycloakJwt } from '@/lib/utils'
import { redirect, RedirectType } from 'next/navigation'
import AvatarCropperDialog from '../components/avatar-cropper-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { revalidatePath } from 'next/cache'

export default async function ProfileSettingsPage() {
    const token = decodeKeycloakJwt(await getServerKeycloakAccessToken(true))
    if (!token) redirect(frontendEndpoints.errors.error_401, RedirectType.replace)

    const profileData = await runAxiosWithErrorHandling(async () => (await userApi.apiV1UserProfileGet()).data)

    async function handleProfileUpdate(formData: FormData) {
        'use server'
        const updateReq = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            bio: formData.get('bio') as string | null,
        }

        await runAxiosWithErrorHandling(async () => await userApi.apiV1UserProfilePut(updateReq))
        revalidatePath('/settings/profile')
    }

    return (
        <div className="py-6 lg:py-10">
            <div className="space-y-6 lg:max-w-4xl">
                <div className="max-lg:px-4">
                    <h3 className="text-lg font-medium">Public profile</h3>
                    <p className="text-sm text-muted-foreground">Manage the information that will be displayed on your public donation page.</p>
                </div>
                <Separator />
                <div className="space-y-6 max-lg:px-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage alt="User avatar" src={profileData.avatarUrl || ''} />
                            <AvatarFallback>{AvatarFalbackGen(token.name)}</AvatarFallback>
                        </Avatar>
                        <AvatarCropperDialog formParamName={'avatar'} uploadUrl={'/api/settings/profile/avatar'} />
                    </div>
                    <form className="flex flex-col gap-4" action={handleProfileUpdate}>
                        <div className="space-y-2">
                            <div>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input required type="text" name="firstName" minLength={1} maxLength={20} defaultValue={token.given_name || 'null'} />
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input required type="text" name="lastName" minLength={1} maxLength={20} defaultValue={token.family_name || 'null'} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                className="min-h-[100px]"
                                name="bio"
                                maxLength={300}
                                defaultValue={profileData.bio || ''}
                                placeholder="Tell us a little bit about yourself"
                            />
                        </div>
                        <Separator />
                        <Button className="max-w-min" type="submit">
                            Update Profile
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
