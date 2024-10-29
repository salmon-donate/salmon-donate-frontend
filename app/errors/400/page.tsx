import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { CircleAlert } from 'lucide-react'

export default function Error400Page() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">400 - Bad Request</CardTitle>
                <CardDescription className="text-center">Oops! Something went wrong.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center mb-4">The server cannot process the request due to an apparent client error.</p>
                <div className="flex justify-center">
                    <CircleAlert className="h-16 w-16 text-yellow-500" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button asChild className="w-full">
                    <Link href="/">Return Home</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
