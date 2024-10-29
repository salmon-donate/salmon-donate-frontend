import jwt from 'jsonwebtoken'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { KeycloakJWT } from './auth'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function AvatarFalbackGen(name?: string | null): string {
    return (
        name
            ?.split(' ')
            .map((w) => (w.length == 0 ? w.toUpperCase() : w[0].toUpperCase()))
            .join('')
            .slice(0, 2) || '?'
    )
}

declare global {
    interface Date {
        toUTC(): Date
    }
}

Date.prototype.toUTC = function () {
    const utcTimestamp = this.getTime() + this.getTimezoneOffset() * 60000

    return new Date(utcTimestamp)
}

export function calcDatesDifferenceInSec(d1: Date, d2: Date) {
    return Math.round((d1.toUTC().getTime() - d2.toUTC().getTime()) / 1000)
}

export function getEnvOrThrow(envName: string): string {
    return (
        process.env[envName] ||
        (() => {
            throw new Error(`Missing ${envName} env var`)
        })()
    )
}

export function decodeKeycloakJwt(accessToken?: string | null) {
    if (!accessToken) return null
    return jwt.decode(accessToken, { json: true }) as KeycloakJWT
}

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

declare global {
    interface Number {
        roundFloat(precision?: number): number
    }
}

// always rounds up to the nearest float
Number.prototype.roundFloat = function (precision: number) {
    if (precision <= 0) return this.valueOf()

    const pow = Math.pow(10, precision)
    return Math.ceil(this.valueOf() * pow) / pow
}

export class SimpleQueue<T> {
    private objects: T[] = []

    constructor() {}

    enqueue(item: T): void {
        this.objects.push(item)
    }
    dequeue(): T | undefined {
        return this.objects.shift()
    }
    size(): number {
        return this.objects.length
    }
}

export function floatToTime(interval: number) {
    const hours = (Math.abs(interval) / 60).toString().split('.')[0].padStart(2, '0')
    const minutes = (Math.abs(interval) % 60).toString().padStart(2, '0')
    return `${hours}:${minutes}`
}

export function timeStrToLocaleStr(timeStr: string) {
    return new Date(timeStr).toLocaleString('en-US', { timeZone: 'UTC' })
}
