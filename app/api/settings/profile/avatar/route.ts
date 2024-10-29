import { userApi } from '@/lib/api'
import { AxiosError } from 'axios'

export async function POST(request: Request) {
    const avatar = (await request.formData()).get('avatar') as File

    try {
        await userApi.apiV1UserProfileAvatarPut(avatar)
    } catch (err) {
        console.log(err)

        if (err instanceof AxiosError) {
            return new Response(err.cause?.message, { status: err.status })
        }

        return new Response('Server Error', { status: 500 })
    }

    return new Response(null, { status: 202 })
}
