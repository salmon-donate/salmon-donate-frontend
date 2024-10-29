import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { donationApi, runAxiosWithErrorHandling } from '@/lib/api'
import { frontendEndpoints } from '@/lib/const'
import { getServerSession } from '@/lib/session'
import { timeStrToLocaleStr } from '@/lib/utils'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { redirect } from 'next/navigation'

const PAGE_SIZE = 20
enum PaginationAction {
    Previous = 'previous',
    Next = 'next',
    First = 'first',
    Last = 'last',
}

export default async function DonationsList({ page = 1 }: { page?: number }) {
    if (!(await getServerSession())) redirect(frontendEndpoints.errors.error_401)

    const { data, totalCount } = await runAxiosWithErrorHandling(async () => (await donationApi.apiV1DonationDonationsGet(PAGE_SIZE, page)).data)
    if (totalCount === undefined) redirect(frontendEndpoints.errors.error_500)
    else if (totalCount === 0) page = 0

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    async function changePage(formData: FormData) {
        'use server'
        const currentPageStr = formData.get('currentPage') as string | null
        const totalPagesStr = formData.get('totalPages') as string | null
        const paginationAction = formData.get('paginationAction') as string | null
        if (!currentPageStr || !totalPagesStr || !paginationAction) return

        let page = parseInt(currentPageStr)
        const totalPages = parseInt(totalPagesStr)

        switch (paginationAction) {
            case PaginationAction.First:
                page = 1
                break
            case PaginationAction.Last:
                page = totalPages
                break
            case PaginationAction.Next:
                page++
                break
            case PaginationAction.Previous:
                page--
                break
        }
        if (page < 1 || page > totalPages) return

        redirect(`/donations?page=${page}`)
    }

    function inputWidth(val: string) {
        switch (val.length) {
            case 1:
                return 'w-8'
            case 2:
                return 'w-10'
            case 3:
                return 'w-12'
            case 4:
                return 'w-14'
            default:
                return ''
        }
    }

    return (
        <div className="w-full text-zinc-100 min-h-screen">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-4">
                    {data
                        .sort((d1, d2) => new Date(d2.createdAt).getTime() - new Date(d1.createdAt).getTime())
                        .map((donation) => (
                            <div key={donation.createdAt} className="bg-zinc-800 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold">{donation.from}</span>
                                        <span className="text-zinc-400">donated</span>
                                        <span className="text-primary">
                                            {donation.amount?.toFixed(8)} {donation.coin}
                                        </span>
                                    </div>
                                    <span className="text-sm text-zinc-400">{timeStrToLocaleStr(donation.createdAt)}</span>
                                </div>
                                <p className="text-sm mt-2">{donation.message}</p>
                            </div>
                        ))}
                </div>
                <form action={changePage}>
                    <div className="mt-8 flex items-center justify-between">
                        <div className="flex-1 flex items-center gap-1 text-sm text-zinc-400">
                            Page <Input className={`${inputWidth(page.toString())} p-0 text-center h-8`} readOnly name="currentPage" value={page} />{' '}
                            of{' '}
                            <Input
                                className={`${inputWidth(totalPages.toString())} p-0 text-center h-8`}
                                readOnly
                                name="totalPages"
                                value={totalPages}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                name="paginationAction"
                                value={PaginationAction.First}
                                type="submit"
                                className="bg-zinc-800 text-zinc-100 border-zinc-700 hover:bg-zinc-700"
                                disabled={page <= 1}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                name="paginationAction"
                                value={PaginationAction.Previous}
                                type="submit"
                                className="bg-zinc-800 text-zinc-100 border-zinc-700 hover:bg-zinc-700"
                                disabled={page <= 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                name="paginationAction"
                                value={PaginationAction.Next}
                                type="submit"
                                className="bg-zinc-800 text-zinc-100 border-zinc-700 hover:bg-zinc-700"
                                disabled={page >= totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                name="paginationAction"
                                value={PaginationAction.Last}
                                type="submit"
                                className="bg-zinc-800 text-zinc-100 border-zinc-700 hover:bg-zinc-700"
                                disabled={page >= totalPages}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
