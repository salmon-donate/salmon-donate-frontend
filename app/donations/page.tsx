import Navbar from '@/components/navbar/navbar'
import DonationsList from './components/donation-list'

export default function DonationsPage({ searchParams }: { searchParams: { page?: string } }) {
    const page = searchParams.page ? parseInt(searchParams.page, 10) : 1
    return (
        <>
            <Navbar />

            <div className="container mx-auto py-10 px-4">
                <DonationsList page={page} />
            </div>
        </>
    )
}
