import React, { ReactNode } from 'react'

export default function ErrorPageLayout({ children }: { children: ReactNode }) {
    return <div className="min-h-screen flex flex-col justify-center items-center">{children}</div>
}
