import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { CurrencyType } from '@/generated/backend-client'
import { runAxiosWithErrorHandling, userApi } from '@/lib/api'
import { floatToTime } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import React from 'react'

export default async function RegionalSettingsPage() {
    const data = await runAxiosWithErrorHandling(async () => (await userApi.apiV1UserProfileRegionalGet()).data)

    async function handleRegionalSettingsUpdate(formData: FormData) {
        'use server'
        const timezone = formData.get('timezone') as string
        const currency = formData.get('currency') as CurrencyType

        await runAxiosWithErrorHandling(async () => await userApi.apiV1UserProfileRegionalPut({ timeZoneName: timezone, currency: currency }))
        revalidatePath('/settings/regional')
    }

    return (
        <div className="py-6 lg:py-10">
            <div className="space-y-6 lg:max-w-4xl">
                <div className="max-lg:px-4">
                    <h3 className="text-lg font-medium">Regional settings</h3>
                    <p className="text-sm text-muted-foreground">
                        Configure your time zone, date format, and currency preferences for a personalized experience.
                    </p>
                </div>

                <Separator />

                <div className="space-y-6 max-lg:px-4">
                    <form className="flex flex-col gap-4" action={handleRegionalSettingsUpdate}>
                        <div className="space-y-2">
                            <div>
                                <Label htmlFor="timezone">Time Zone</Label>
                                <Select required name="timezone" defaultValue={data.timeZone.name}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Your Time Zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {data.availableTimeZones.map((tz) => (
                                            <SelectItem key={tz.name} value={tz.name}>
                                                {tz.offset !== undefined &&
                                                    `(GMT${tz.offset >= 0 ? '+' : '-'}${floatToTime(tz.offset)}) ${tz.name.replaceAll('_', ' ')}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="currency">Currency</Label>
                                <Select required name="currency" defaultValue={data.currency}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Your Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(CurrencyType).map((ct) => (
                                            <SelectItem key={ct} value={ct}>
                                                {ct.toUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Separator />
                        <Button className="max-w-min" type="submit">
                            Update
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
