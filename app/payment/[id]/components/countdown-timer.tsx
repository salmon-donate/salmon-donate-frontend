'use client'

import { useState, useEffect } from 'react'

export default function CountdownTimer({ initialSeconds }: { initialSeconds: number }) {
    const [seconds, setSeconds] = useState(initialSeconds)

    useEffect(() => {
        if (seconds > 0) {
            const timer = setTimeout(() => setSeconds(seconds - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [seconds])

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return (
        <div className="text-xl font-semibold">
            Time remaining: {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{remainingSeconds.toString().padStart(2, '0')}
        </div>
    )
}
