'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bitcoin, LogOut, Settings, User } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import { AvatarFalbackGen } from '@/lib/utils'

interface AuthSidebarProps {
    name?: string | null
    email?: string | null
    username?: string | null
    avatarUrl?: string | null
}

export default function AuthSidebar({ name, email, username, avatarUrl }: AuthSidebarProps) {
    const [open, setOpen] = React.useState(false)

    const links = [
        { name: 'Profile', href: `/user/${username}`, icon: User },
        { name: 'Donations', href: '/donations', icon: Bitcoin },
        { name: 'Settings', href: '/settings/profile', icon: Settings },
    ]

    function getAvatar() {
        return (
            <Avatar className="max-sm:w-10 max-sm:h-10">
                <AvatarImage src={avatarUrl || ''} />
                <AvatarFallback>{AvatarFalbackGen(name)}</AvatarFallback>
            </Avatar>
        )
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0" aria-label="Open user menu">
                    {getAvatar()}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <SheetHeader className="border-b p-4">
                    <SheetTitle className="flex items-center gap-2">
                        {getAvatar()}
                        <div className="flex flex-col">
                            {username ? <span className="text-lg font-semibold">{username}</span> : <Skeleton className="h-4 w-40" />}
                            {email ? <span className="text-sm text-muted-foreground">{email}</span> : <Skeleton className="h-4 w-56" />}
                        </div>
                    </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-60px)]">
                    <div className="flex flex-col gap-2 p-4">
                        {links.map((item) => (
                            <Button key={item.href} variant="ghost" className="w-full justify-start gap-2" onClick={() => setOpen(false)} asChild>
                                <Link href={item.href}>
                                    {item.icon && <item.icon className="h-5 w-5" />}
                                    {item.name}
                                </Link>
                            </Button>
                        ))}
                    </div>
                    <div className="border-t p-4">
                        <form action="/api/auth/signout" method="GET">
                            <Button variant="ghost" onClick={() => setOpen(false)} className="w-full justify-start gap-2" type="submit">
                                <LogOut className="h-5 w-5" />
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
