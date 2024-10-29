import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { donationApi, runAxiosWithErrorHandling } from '@/lib/api'
import { AvatarFalbackGen } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { cryptoList } from '@/lib/const'
import { CryptoType } from '@/generated/backend-client'

export default async function DonationPage({ params }: { params: { username: string } }) {
    const donationData = await runAxiosWithErrorHandling(async () => (await donationApi.apiV1DonationDonateUsernameGet(params.username)).data)
    const name = `${donationData.firstName} ${donationData.lastName}`

    async function handleDonation(formData: FormData) {
        'use server'
        const donationReq = {
            from: formData.get('username') as string,
            message: formData.get('message') as string | null,
            coin: formData.get('coin') as CryptoType,
        }

        const res = await runAxiosWithErrorHandling(
            async () => (await donationApi.apiV1DonationDonateUsernamePost(params.username, donationReq)).data
        )
        redirect(`/payment/${res.paymentId}`)
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex items-start space-x-4 mb-4">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={donationData.avatarUrl || ''} alt="Avatar" />
                            <AvatarFallback>{AvatarFalbackGen(name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <CardTitle className="text-2xl mb-2">{name}</CardTitle>
                            <p className="text-sm">{donationData.bio}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" action={handleDonation}>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                required
                                id="username"
                                name="username"
                                minLength={1}
                                maxLength={50}
                                type="text"
                                placeholder="Enter your username"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" name="message" maxLength={300} rows={5} placeholder="Enter your message (optional)" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="donation-method">Donation Method</Label>
                            <Select required name="coin">
                                <SelectTrigger id="donation-method">
                                    <SelectValue placeholder="Select donation method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[...donationData.acceptedCrypto].map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {`${cryptoList.get(c)} (${c})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full" type="submit">
                            Donate
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
