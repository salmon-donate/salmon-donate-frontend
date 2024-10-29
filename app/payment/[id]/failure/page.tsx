import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'

export default function PaymentFailurePage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <XCircle className="h-10 w-10 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Payment Failed</CardTitle>
                    <CardDescription>We&apos;re sorry, but your payment could not be processed.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert variant="destructive">
                        <AlertTitle className="font-semibold">Error Details</AlertTitle>
                        <AlertDescription>
                            Payment ID: {params.id}
                            <br />
                            Reason: Unknown {/*TODO*/}
                        </AlertDescription>
                    </Alert>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Please try again or use a different payment method.</p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Link href="/" className="w-full">
                        <Button variant="outline" className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Return Home
                        </Button>
                    </Link>
                    <Link href="/support" className="w-full">
                        <Button variant="link" className="w-full">
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Contact Support
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
