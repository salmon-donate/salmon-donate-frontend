import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { LockIcon } from 'lucide-react'
import { frontendEndpoints } from '@/lib/const'

export default function Error401Page() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">401 - Unauthorized</CardTitle>
                <CardDescription className="text-center">Access Denied</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center mb-4">
                    Sorry, you don&apos;t have permission to access this page. Please log in or contact the administrator.
                </p>
                <div className="flex justify-center">
                    <LockIcon className="h-16 w-16 text-yellow-500" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-center space-x-4">
                <Button asChild className="w-full">
                    <Link href={frontendEndpoints.auth.signIn.keycloak}>Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/">Return Home</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
