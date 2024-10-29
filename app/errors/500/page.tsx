import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function Error500Page() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">500 - Internal Server Error</CardTitle>
                <CardDescription className="text-center">Oops! Something went wrong on our end.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center mb-4">
                    We&apos;re sorry, but we&apos;re experiencing some technical difficulties. Our team has been notified and is working on resolving
                    the issue.
                </p>
                <div className="flex justify-center">
                    <AlertTriangle className="h-16 w-16 text-yellow-500" />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
                <Button asChild className="w-full">
                    <Link href="/">Return Home</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
