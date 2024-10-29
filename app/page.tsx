import * as React from 'react'
import Link from 'next/link'
import { Code, Server, Lock, Bitcoin, BarChart, Coins, ChartBar } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/navbar/navbar'
import { getServerKeycloakAccessToken, getServerSession } from '@/lib/session'
import { runAxiosWithErrorHandling, statsApi } from '@/lib/api'
import { decodeKeycloakJwt, timeStrToLocaleStr } from '@/lib/utils'
import { StatsPeriod } from '@/generated/backend-client'

async function LandingPage() {
    return (
        <main className="flex-1">
            <section className="container mx-auto px-4 py-24 text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">Accept Crypto Donations with Ease</h1>
                <p className="mt-4 mx-auto max-w-[700px] text-muted-foreground text-lg sm:text-xl">
                    Salmon Donate: An open-source, self-hosted, and non-custodial solution for receiving cryptocurrency donations.
                </p>
                <div className="mt-8 flex justify-center space-x-4">
                    <Button size="lg" asChild>
                        <Link href="#get-started">Get Started</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="https://github.com/salmon-donate/salmon-donate">View on GitHub</Link>
                    </Button>
                </div>
            </section>
            <section id="features" className="bg-muted py-24">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Why Choose Salmon Donate?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <Card>
                            <CardHeader>
                                <Code className="h-12 w-12 text-primary mb-4" />
                                <CardTitle>Open Source</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Transparent and community-driven development</CardDescription>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Server className="h-12 w-12 text-primary mb-4" />
                                <CardTitle>Self-Hosted</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Full control over your donation system</CardDescription>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Lock className="h-12 w-12 text-primary mb-4" />
                                <CardTitle>Non-Custodial</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Your keys, your crypto - always</CardDescription>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Bitcoin className="h-12 w-12 text-primary mb-4" />
                                <CardTitle>Crypto Donations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Accept a wide range of cryptocurrencies</CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </main>
    )
}

async function DashboardPage() {
    const token = decodeKeycloakJwt(await getServerKeycloakAccessToken())
    const data = await runAxiosWithErrorHandling(async () => (await statsApi.apiV1StatsDonationGet(StatsPeriod.AllTime)).data)

    return (
        <main className="flex-1 py-8">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-6">Welcome back, {token?.name}!</h2>
                <h3 className="text-xl font-semibold mb-4">Current Month&apos;s Stats</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                            <Coins className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data.amount?.toFixed(2)} {data.amountCurrency}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Donation Count</CardTitle>
                            <BarChart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.donationCount}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Amount</CardTitle>
                            <ChartBar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data.avgAmount?.toFixed(2)} {data.amountCurrency}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <h3 className="text-xl font-semibold mt-8 mb-4">Top 3 Donations By Amount</h3>
                <Card>
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4">Date</th>
                                    <th className="text-left p-4">Amount</th>
                                    <th className="text-left p-4">Currency</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.top3DonationsByAmount.map((d) => (
                                    <tr key={d.createdAt} className="border-b">
                                        <td className="p-4">{timeStrToLocaleStr(d.createdAt)}</td>
                                        <td className="p-4">{d.amount?.toFixed(8)}</td>
                                        <td className="p-4">{d.coin}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}

export default async function HomePage() {
    const session = await getServerSession()

    return (
        <div>
            <Navbar />
            <div className="flex flex-col min-h-screen bg-background">
                {await (session ? DashboardPage() : LandingPage())}

                <footer className="border-t py-6">
                    <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
                        <p className="text-sm text-muted-foreground">© 2024 Salmon Donate. Open-source software.</p>
                        <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
                            <Link
                                className="text-sm text-muted-foreground hover:underline"
                                href="https://github.com/salmon-donate/salmon-donate/blob/master/LICENSE"
                            >
                                License
                            </Link>
                            <Link
                                className="text-sm text-muted-foreground hover:underline"
                                href="https://github.com/salmon-donate/salmon-donate/issues"
                            >
                                Report an Issue
                            </Link>
                        </nav>
                    </div>
                </footer>
            </div>
        </div>
    )
}
