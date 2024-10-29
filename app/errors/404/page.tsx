import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { FileX } from 'lucide-react'

export default function Error404Page() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">404 - Not Found</CardTitle>
                <CardDescription className="text-center">Page Not Found</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center mb-4">Sorry, the resource you requested does not exist. Please check the URL or return to the homepage.</p>
                <div className="flex justify-center">
                    <FileX className="h-16 w-16 text-yellow-500" />
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
