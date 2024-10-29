import { CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function PaymentSuccessPage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Payment Successful!</CardTitle>
                    <CardDescription>Your crypto payment has been processed successfully.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Payment ID</span>
                        <span className="text-sm font-mono">{params.id}</span>
                    </div>
                    <Separator />
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Link href="/" className="w-full">
                        <Button className="w-full">
                            <ArrowLeft className="ml-2 h-4 w-4" />
                            Return Home
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
