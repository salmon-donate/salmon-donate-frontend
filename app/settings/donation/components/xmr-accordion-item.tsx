'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DonationProfileDataResponse } from '@/generated/backend-client'
import React, { useState } from 'react'

interface KeysAccordionProps {
    donationData: DonationProfileDataResponse
    handler: (formData: FormData) => Promise<void>
}

function XmrAccordionItem({ donationData, handler }: KeysAccordionProps) {
    const [enabled, setEnabled] = useState(donationData.cryptoKeysData.xmr.enabled || false)

    return (
        <AccordionItem value="xmr" className="max-lg:px-2">
            <AccordionTrigger>XMR</AccordionTrigger>
            <AccordionContent>
                <form className="flex flex-col gap-3" action={handler}>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            className="rounded-[5px]"
                            id="xmrEnabled"
                            name="enabled"
                            onCheckedChange={() => setEnabled((val) => !val)}
                            defaultChecked={donationData.cryptoKeysData.xmr.enabled}
                        />
                        <Label htmlFor="xmrEnabled">Enable</Label>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="xmrPrivKey">XMR Private View Key</Label>
                        <Input
                            disabled={!enabled}
                            required
                            type="text"
                            id="xmrPrivKey"
                            name="xmrPrivKey"
                            minLength={64}
                            maxLength={64}
                            defaultValue={donationData.cryptoKeysData.xmr.keys.priv || ''}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="xmrPubKey">XMR Public Spend Key</Label>
                        <Input
                            disabled={!enabled}
                            required
                            type="text"
                            id="xmrPubKey"
                            name="xmrPubKey"
                            minLength={64}
                            maxLength={64}
                            defaultValue={donationData.cryptoKeysData.xmr.keys.pub || ''}
                        />
                    </div>
                    <Button className="max-w-min" type="submit">
                        Update
                    </Button>
                </form>
            </AccordionContent>
        </AccordionItem>
    )
}

export default XmrAccordionItem
