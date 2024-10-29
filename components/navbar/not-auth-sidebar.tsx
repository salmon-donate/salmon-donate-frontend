'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Link from 'next/link'

const menuItems = [
    { href: '#features', label: 'Features' },
    { href: '#get-started', label: 'Get Started' },
    { href: 'https://github.com/salmon-donate/salmon-donate', label: 'GitHub' },
] as const

export default function NotAuthBar() {
    const [isOpen, setIsOpen] = useState(false)

    const NavItems = () => (
        <>
            {menuItems.map((item) => (
                <NavigationMenuItem key={item.href} onClick={() => setIsOpen(false)}>
                    <NavigationMenuLink href={item.href} className="text-sm font-medium">
                        {item.label}
                    </NavigationMenuLink>
                </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
                <Link href="/api/auth/signin/keycloak">
                    <Button>Sign In</Button>
                </Link>
            </NavigationMenuItem>
        </>
    )

    return (
        <nav className="flex p-4">
            <NavigationMenu className="hidden md:block">
                <NavigationMenuList className="flex gap-8">
                    <NavItems />
                </NavigationMenuList>
            </NavigationMenu>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                    <Button variant="outline" size="icon" aria-label="Menu">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="flex flex-col items-center">
                    <NavigationMenu className="mt-8">
                        <NavigationMenuList className="flex flex-col gap-4 w-full">
                            <NavItems />
                        </NavigationMenuList>
                    </NavigationMenu>
                </SheetContent>
            </Sheet>
        </nav>
    )
}
