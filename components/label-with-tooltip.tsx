import React, { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'

interface LabelWithTooltipProps {
    htmlFor?: string
    label?: string
    children?: ReactNode
}

export default function LabelWithTooltip(
    { htmlFor, label, children }: LabelWithTooltipProps = {
        htmlFor: 'example',
        label: 'Example Label',
        children: <p>This is an example tooltip description</p>,
    }
) {
    return (
        <div className="flex items-center gap-1">
            <Label htmlFor={htmlFor}>{label}</Label>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">{children}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}
