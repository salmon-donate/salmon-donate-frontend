import { ReactNode } from 'react'
import NavContent from './components/nav-content'
import Link from 'next/link'
import { User } from 'lucide-react'
import CustomSheet from './components/sheet'
import Navbar from '@/components/navbar/navbar'

export default async function SettingsLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <Navbar />
            <div className="bg-background">
                <header className="w-full border-b bg-background lg:hidden">
                    <div className="container flex h-14 items-center">
                        <CustomSheet />
                        <div className="flex items-center gap-2">
                            <User className="h-6 w-6" />
                            <span className="font-semibold">Account settings</span>
                        </div>
                    </div>
                </header>
                <div className="flex gap-8">
                    <aside className="hidden w-64 shrink-0 lg:block">
                        <div className="flex h-full flex-col gap-2">
                            <div className="flex h-14 items-center border-b px-4">
                                <Link className="flex items-center gap-2 font-semibold" href="#">
                                    <User className="h-6 w-6" />
                                    <span>Account settings</span>
                                </Link>
                            </div>
                            <div className="px-4 py-2">
                                <NavContent />
                            </div>
                        </div>
                    </aside>
                    <main className="flex-1 overflow-y-auto">{children}</main>
                </div>
            </div>
        </div>
    )
}
