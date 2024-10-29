import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ConfirmationType } from '@/generated/backend-client'
import { runAxiosWithErrorHandling, userApi } from '@/lib/api'
import React from 'react'
import XmrAccordionItem from './components/xmr-accordion-item'
import { revalidatePath } from 'next/cache'
import LabelWithTooltip from '@/components/label-with-tooltip'

export default async function DonationSettingsPage() {
    async function handleDonationDataUpdate(formData: FormData) {
        'use server'

        const updateReq = {
            minAmount: parseFloat(formData.get('minAmount') as string),
            timeout: parseInt(formData.get('timeout') as string),
            confirmationType: formData.get('confirmationType') as ConfirmationType,
        }

        await runAxiosWithErrorHandling(async () => await userApi.apiV1UserProfileDonationDataPut(updateReq))
        revalidatePath('/settings/donation')
    }

    async function handleXMRDonationDataUpdate(formData: FormData) {
        'use server'

        const updateReq = {
            enabled: formData.has('enabled'),
            keys: {
                priv: (formData.get('xmrPrivKey') as string) || '',
                pub: (formData.get('xmrPubKey') as string) || '',
            },
        }

        await runAxiosWithErrorHandling(async () => await userApi.apiV1UserProfileDonationDataXmrPut(updateReq))
        revalidatePath('/settings/donation')
    }

    const donationData = await runAxiosWithErrorHandling(async () => (await userApi.apiV1UserProfileDonationDataGet()).data)

    return (
        <div className="py-6 lg:py-10">
            <div className="space-y-6 lg:max-w-4xl">
                <div className="max-lg:px-4">
                    <h3 className="text-lg font-medium">Donation settings</h3>
                    <p className="text-sm text-muted-foreground">
                        Configure your donation parameters, including the minimum donation amount and cryptocurrency keys.
                    </p>
                </div>

                <Separator />

                <form className="flex flex-col gap-4" action={handleDonationDataUpdate}>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2 pb-1">
                            <h4 className="text-base font-medium max-lg:px-2">Basic donation settings</h4>
                            <Separator />
                        </div>
                        <div className="flex flex-col gap-1 max-lg:px-2">
                            <div className="space-y-1">
                                <LabelWithTooltip htmlFor={'minAmount'} label={'Min Amount'}>
                                    <div>
                                        <p>The minimum amount a user must pay for the receiver to accept the donation.</p>
                                        <div className="mt-2">
                                            <p className="font-semibold">Constraints:</p>
                                            <ul className="list-disc list-inside ml-4">
                                                <li>Min: 0 {donationData.minAmountCurrency} (any amount)</li>
                                                <li>Max: 180,000,000,000 {donationData.minAmountCurrency}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </LabelWithTooltip>
                                <div className="flex">
                                    <Input
                                        required
                                        type="number"
                                        step={0.1}
                                        min={0}
                                        max={180_000_000_000}
                                        name="minAmount"
                                        id="minAmount"
                                        defaultValue={donationData.minAmount || 0}
                                    />
                                    <Input readOnly type="text" value={donationData.minAmountCurrency} className="w-14 rounded-l-md text-center" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <LabelWithTooltip htmlFor={'timeout'} label={'Timeout'}>
                                    <div>
                                        <p>
                                            The maximum amount of time (in seconds) allowed before the payment expires if the crypto transaction is
                                            not confirmed.
                                        </p>
                                        <div className="mt-2">
                                            <p className="font-semibold">Constraints:</p>
                                            <ul className="list-disc list-inside ml-4">
                                                <li>Min: 60 seconds</li>
                                                <li>Max: 86,400 seconds</li>
                                            </ul>
                                        </div>
                                    </div>
                                </LabelWithTooltip>
                                <Input
                                    required
                                    type="number"
                                    step={5}
                                    min={60}
                                    max={86400}
                                    name="timeout"
                                    id="timeout"
                                    defaultValue={donationData.timeout || 60}
                                />
                            </div>

                            <div className="space-y-1">
                                <LabelWithTooltip htmlFor="confirmationType" label={'Confirmation Type'}>
                                    <div>
                                        <p>Specifies the type of confirmation required for the payment (transaction) to be processed.</p>
                                        <div className="mt-2">
                                            <p className="font-semibold">Types:</p>
                                            <ul className="list-disc list-inside ml-4">
                                                <li>{ConfirmationType.Unconfirmed} - 0 conf</li>
                                                <li>{ConfirmationType.PartiallyConfirmed} - from 1 to 3 confs (depends on crypto)</li>
                                                <li>{ConfirmationType.Confirmed} - from 6 to 10 confs (depends on crypto)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </LabelWithTooltip>

                                <Select required name="confirmationType" defaultValue={donationData.confirmationType}>
                                    <SelectTrigger className="w-[220px]">
                                        <SelectValue placeholder="Confirmation Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(ConfirmationType).map((ct) => (
                                            <SelectItem key={ct} value={ct}>
                                                {ct.replaceAll('_', ' ')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="max-lg:px-2">
                        <Button className="max-w-min" type="submit">
                            Update
                        </Button>
                    </div>
                </form>

                <div>
                    <div className="flex flex-col gap-2">
                        <h4 className="text-base font-medium max-lg:px-2">Crypto Keys</h4>
                        <Separator />
                    </div>

                    <Accordion id="cryptoKeys" type="single" collapsible>
                        <XmrAccordionItem donationData={donationData} handler={handleXMRDonationDataUpdate} />
                    </Accordion>
                </div>
            </div>
        </div>
    )
}
