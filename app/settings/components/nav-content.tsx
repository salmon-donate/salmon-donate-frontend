'use client'

import { Bell, Bitcoin, Earth, KeyRound, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
    { name: 'Public profile', href: '/settings/profile', icon: User },
    { name: 'Account security', href: '/settings/security', icon: KeyRound },
    { name: 'Donation', href: '/settings/donation', icon: Bitcoin },
    { name: 'Notification', href: '/settings/notification', icon: Bell },
    { name: 'Regional settings', href: '/settings/regional', icon: Earth },
]

export default function NavContent() {
    const currentPath = usePathname()

    return (
        <nav className="grid gap-1">
            {links.map((link) => (
                <Link
                    key={link.name}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground ${link.href == currentPath ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}`}
                    href={link.href}
                >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                </Link>
            ))}
        </nav>
    )
}
