import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { ShieldXIcon } from 'lucide-react'

export default function Error403Page() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">403 - Forbidden</CardTitle>
                <CardDescription className="text-center">Access Denied</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center mb-4">
                    Sorry, you don&apos;t have permission to access this page. If you believe this is an error, please contact the administrator.
                </p>
                <div className="flex justify-center">
                    <ShieldXIcon className="h-16 w-16 text-yellow-500" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-center space-x-4">
                <Button asChild className="w-full">
                    <Link href="/">Return Home</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
