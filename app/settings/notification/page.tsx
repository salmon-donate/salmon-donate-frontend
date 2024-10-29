import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { donationApi, runAxiosWithErrorHandling, userApi } from '@/lib/api'
import React from 'react'
import { Button } from '@/components/ui/button'
import { httpConfig } from '@/lib/config'
import { revalidatePath } from 'next/cache'

export default async function NotificationSettingsPage() {
    const notificationToken = await runAxiosWithErrorHandling(async () => (await userApi.apiV1UserProfileNotificationGet()).data)
    const notficationLink = `${httpConfig.frontendBaseUrl}/notification?token=${notificationToken}`

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function handleNotificationTokenUpdate(formData: FormData) {
        'use server'

        await runAxiosWithErrorHandling(async () => await userApi.apiV1UserProfileNotificationPut())
        revalidatePath('/settings/notification')
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function handleSendTestDonation(formData: FormData) {
        'use server'

        await runAxiosWithErrorHandling(async () => await donationApi.apiV1DonationNotificationTestPost())
    }

    return (
        <div className="py-6 lg:py-10">
            <div className="space-y-6 lg:max-w-4xl">
                <div className="max-lg:px-4">
                    <h3 className="text-lg font-medium">Notification settings</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your preferences for receiving alerts and updates related to donations and other activities.
                    </p>
                </div>

                <Separator />

                <Accordion type="single" collapsible>
                    <AccordionItem value="notification" className="max-lg:px-2">
                        <AccordionTrigger>Donation Notification Link</AccordionTrigger>
                        <AccordionContent>
                            <form className="flex flex-col gap-3" action={handleNotificationTokenUpdate}>
                                <div className="flex flex-col gap-1">
                                    <Input required readOnly type="text" id="notificationLink" value={notficationLink} />
                                </div>
                                <Button className="max-w-min" type="submit">
                                    Regenerate Token
                                </Button>
                            </form>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <form className="max-lg:px-2" action={handleSendTestDonation}>
                    <Button type="submit">Send Test Donation</Button>
                </form>
            </div>
        </div>
    )
}
