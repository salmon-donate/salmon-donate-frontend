'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Image from 'next/image'
import { Input } from '@/components/ui/input'

interface AvatarCropperDialogProps {
    formParamName: string
    uploadUrl: string
}

export default function AvatarCropperDialog({ formParamName, uploadUrl }: AvatarCropperDialogProps) {
    const [open, setOpen] = useState(false)
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
    const [crop, setCrop] = useState<Crop | undefined>(undefined)
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null)
    const [mimeType, setMimeType] = useState<string>('image/jpeg')
    const imageRef = useRef<HTMLImageElement | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader()
            reader.addEventListener('load', () => setOriginalImageUrl(reader.result?.toString() || null))
            reader.readAsDataURL(e.target.files[0])
            setMimeType(e.target.files[0].type)
        }
    }

    const resetComponent = () => {
        setOriginalImageUrl(null)
        setCrop(undefined)
        setCroppedImageUrl(null)
    }
    useEffect(() => {
        if (!open) setTimeout(resetComponent, 100)
    }, [open])

    const onCropComplete = (crop: Crop) => {
        if (imageRef.current && crop.width && crop.height) {
            const croppedImageUrl = getCroppedImg(imageRef.current, crop)
            setCroppedImageUrl(croppedImageUrl)
        }
    }

    async function handleSubmit() {
        if (!imageRef.current || !originalImageUrl) return
        setIsSubmitting(true)

        const image = croppedImageUrl ? croppedImageUrl : originalImageUrl

        const avatarBlob = await (await fetch(image)).blob()
        const form = new FormData()
        form.set(formParamName, avatarBlob)

        await fetch(uploadUrl, {
            method: 'POST',
            body: form,
        })

        setIsSubmitting(false)
        setOpen(false)

        window.location.reload()
    }

    const getCroppedImg = (image: HTMLImageElement, crop: Crop) => {
        const canvas = document.createElement('canvas')
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        canvas.width = crop.width
        canvas.height = crop.height
        const ctx = canvas.getContext('2d')

        if (ctx) {
            ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height)
        }

        return canvas.toDataURL(mimeType)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Change Avatar</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                    <DialogTitle>Change avatar</DialogTitle>
                    <DialogDescription>Upload an image and crop it to your desired size.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {originalImageUrl && (
                        <ReactCrop crop={crop} onChange={(c) => setCrop(c)} circularCrop aspect={1} onComplete={onCropComplete}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Image ref={imageRef} height={400} width={400} src={originalImageUrl} alt="Crop me" />
                            </div>
                        </ReactCrop>
                    )}
                    <div className="gap-4">
                        <Input id="picture" type="file" accept="image/*" onChange={onSelectFile} />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
