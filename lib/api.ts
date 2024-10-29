import axios from 'axios'
import { getServerKeycloakAccessToken } from './session'
import { httpConfig } from './config'
import { DonationResourceApi, PaymentResourceApi, StatsResourceApi, UserResourceApi } from '@/generated/backend-client'
import { redirect } from 'next/navigation'
import { frontendEndpoints } from './const'

const backendAxios = axios.create({
    baseURL: httpConfig.backendBaseUrl,
    withCredentials: true,
})

backendAxios.interceptors.request.use(async (config) => {
    const token = await getServerKeycloakAccessToken()
    if (!token) return config

    config.headers['Authorization'] = `Bearer ${token}`
    return config
})

export const userApi = new UserResourceApi(undefined, undefined, backendAxios)
export const donationApi = new DonationResourceApi(undefined, undefined, backendAxios)
export const paymentApi = new PaymentResourceApi(undefined, undefined, backendAxios)
export const statsApi = new StatsResourceApi(undefined, undefined, backendAxios)

export async function runAxiosWithErrorHandling<T>(fn: () => Promise<T>): Promise<T> {
    try {
        return await fn()
    } catch (err) {
        console.log(err)

        if (axios.isAxiosError(err)) {
            switch (parseInt(err.code || '500')) {
                case 400:
                    redirect(frontendEndpoints.errors.error_400)
                case 401:
                    redirect(frontendEndpoints.errors.error_401)
                case 403:
                    redirect(frontendEndpoints.errors.error_403)
                case 500:
                    redirect(frontendEndpoints.errors.error_500)
                default:
                    redirect(frontendEndpoints.errors.error_500)
            }
        }
        return redirect(frontendEndpoints.errors.error_500)
    }
}
