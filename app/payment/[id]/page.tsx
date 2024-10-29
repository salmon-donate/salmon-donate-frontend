import { Suspense } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import CountdownTimer from './components/countdown-timer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { paymentApi, runAxiosWithErrorHandling } from '@/lib/api'
import { cryptoList, frontendEndpoints } from '@/lib/const'
import SsePaymentListener from './components/sse-payment-listener'
import { httpConfig } from '@/lib/config'
import LabelWithTooltip from '@/components/label-with-tooltip'

async function generateQRCode(data: string) {
    try {
        return await QRCode.toDataURL(data)
    } catch (err) {
        console.error(err)
        return ''
    }
}

export default async function PaymentPage({ params }: { params: { id: string } }) {
    const invoice = await runAxiosWithErrorHandling(async () => (await paymentApi.apiV1PaymentPaymentIdDonationGet(params.id)).data)
    const amount = invoice.requiredAmount?.roundFloat(8)

    const qrCodeData = await generateQRCode(`${cryptoList.get(invoice.coin)}:${invoice.cryptoAddress}?amount=${amount}`)

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <h1 className="text-2xl text-primary font-bold text-center">Crypto Payment</h1>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-1">
                        <div>
                            <Label htmlFor="address">Crypto Address</Label>
                            <Input id="address" type="text" value={invoice.cryptoAddress} readOnly className="py-2" />
                        </div>

                        <div className="space-y-[2px]">
                            <LabelWithTooltip htmlFor="amount" label="Min Amount">
                                <p>The minimum amount you must pay for the receiver to accept the donation.</p>
                            </LabelWithTooltip>
                            <Input id="amount" type="text" value={`${amount} ${invoice.coin}`} readOnly className="py-2" />
                        </div>

                        <div>
                            <Label htmlFor="paymentId">Payment ID</Label>
                            <Input id="paymentId" type="text" value={invoice.paymentId} readOnly className="py-2" />
                        </div>
                    </div>

                    <div className="flex justify-center mt-4">
                        <Image src={qrCodeData} alt="Payment QR Code" width={200} height={200} />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col justify-center">
                    <Suspense fallback={<div>Loading timer...</div>}>
                        <CountdownTimer initialSeconds={invoice.timeout || 0} />
                    </Suspense>
                </CardFooter>
            </Card>
            <SsePaymentListener paymentId={invoice.paymentId} backendBaseUrl={httpConfig.backendBaseUrl} errorEndpoints={frontendEndpoints.errors} />
        </div>
    )
}
