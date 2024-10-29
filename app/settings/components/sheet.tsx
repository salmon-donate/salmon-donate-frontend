'use client'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
import { Menu, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NavContent from './nav-content'

export default function CustomSheet() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 lg:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-14 items-center border-b px-4">
                    <div className="flex items-center gap-2 font-semibold">
                        <User className="h-6 w-6" />
                        <span>Account settings</span>
                    </div>
                </div>
                <div className="px-4 py-2" onClick={() => setOpen(false)}>
                    <NavContent />
                </div>
            </SheetContent>
        </Sheet>
    )
}
