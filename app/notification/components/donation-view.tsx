'use client'

import { ApiV1DonationNotificationGet200ResponseNameEnum as sseMsgType, DonationDTO } from '@/generated/backend-client'
import { frontendEndpoints } from '@/lib/const'
import { delay } from '@/lib/utils'
import { Mutex } from 'async-mutex'
import EventSource from 'eventsource'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface DonationViewProps {
    backendBaseUrl: string
    token: string
    errorEndpoints: typeof frontendEndpoints.errors
}

export default function DonationView({ backendBaseUrl, token, errorEndpoints }: DonationViewProps) {
    const router = useRouter()

    const mutex = new Mutex()
    const [currentDonation, setCurrentDonation] = useState<DonationDTO | null>(null)

    async function showDonation(donation: DonationDTO) {
        const release = await mutex.acquire()

        setCurrentDonation(donation)
        await delay(5000)
        setCurrentDonation(null)

        release()
    }

    useEffect(() => {
        const url = new URL(`${backendBaseUrl}/api/v1/donation/notification`)
        url.searchParams.append('token', token)

        const sse = new EventSource(url.toString())
        sse.addEventListener(sseMsgType.NewDonation, (res) => {
            showDonation(JSON.parse(res.data) as DonationDTO)
        })
        sse.onerror = (err) => {
            console.log(err)

            switch (err.status) {
                case 400:
                    router.replace(errorEndpoints.error_400)
                    break
                case 401:
                    router.replace(errorEndpoints.error_401)
                    break
                case 403:
                    router.replace(errorEndpoints.error_403)
                    break
                case 500:
                    router.replace(errorEndpoints.error_500)
                    break
                default:
                    router.replace(errorEndpoints.error_500)
            }
        }

        return () => sse.close()
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent">
            {currentDonation && (
                <div className="text-center space-y-6 max-w-2xl mx-auto p-8">
                    {/*TODO*/}
                    {false && <Image src={''} alt="" />}
                    <audio autoPlay src="/sounds/tuturu_sound.mp3" />
                    <h2 className="text-2xl font-bold text-primary">{`${currentDonation.from} - ${currentDonation.amount} ${currentDonation.coin}`}</h2>
                    <p className="text-xl text-white leading-relaxed">{currentDonation.message}</p>
                </div>
            )}
        </div>
    )
}
