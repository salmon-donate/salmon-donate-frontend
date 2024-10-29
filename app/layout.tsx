import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Salmon Donate',
    icons: {
        icon: '/logo/salmon-donate-logo.svg',
    },
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="dark">
            <body className="antialiased flex flex-col">{children}</body>
        </html>
    )
}
