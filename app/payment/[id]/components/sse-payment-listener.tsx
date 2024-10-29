'use client'

import { ApiV1PaymentPaymentIdStatusGet200ResponseNameEnum as sseMsgType, InvoiceDTO, InvoiceStatusType } from '@/generated/backend-client'
import { frontendEndpoints } from '@/lib/const'
import EventSource from 'eventsource'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface SsePaymentListenerProps {
    paymentId: string
    backendBaseUrl: string
    errorEndpoints: typeof frontendEndpoints.errors
}

export default function SsePaymentListener({ paymentId, backendBaseUrl, errorEndpoints }: SsePaymentListenerProps) {
    const router = useRouter()

    useEffect(() => {
        const sse = new EventSource(`${backendBaseUrl}/api/v1/payment/${paymentId}/status`)
        sse.addEventListener(sseMsgType.PaymentChangedStatus, (res) => {
            const newStatusInvoice = JSON.parse(res.data) as InvoiceDTO
            switch (newStatusInvoice.status) {
                case InvoiceStatusType.Expired:
                    router.replace(`/payment/${paymentId}/failure`)
                    break
                case InvoiceStatusType.Confirmed:
                    router.replace(`/payment/${paymentId}/success`)
                    break
            }
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
            }
        }

        return () => sse.close()
    }, [])

    return null
}
