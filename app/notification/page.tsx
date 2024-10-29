import { httpConfig } from '@/lib/config'
import { frontendEndpoints } from '@/lib/const'
import { redirect } from 'next/navigation'
import DonationView from './components/donation-view'

interface NotificationPageProps {
    searchParams: { [key: string]: string | undefined }
}

export default function NotificationPage({ searchParams }: NotificationPageProps) {
    const token = searchParams.token
    if (!token) redirect(frontendEndpoints.errors.error_401)

    return <DonationView backendBaseUrl={httpConfig.backendBaseUrl} token={token} errorEndpoints={frontendEndpoints.errors} />
}
