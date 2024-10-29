import { Adapter, DatabaseSession, DatabaseUser, UserId } from 'lucia'
import { RedisClientType, RedisDefaultModules, RedisFunctions, RedisModules, RedisScripts } from 'redis'
import superjson from 'superjson'
import { calcDatesDifferenceInSec } from './utils'

function getSessionKey(sessionId: string) {
    return `session:${sessionId}`
}
function getUserSessionsKey(userId: string) {
    return `user:${userId}:sessions`
}
function calcTTL(expiresAt: Date) {
    return Math.max(calcDatesDifferenceInSec(expiresAt, new Date()), 0)
}

export class BasicSessionRedisAdapter<M extends RedisModules, F extends RedisFunctions, S extends RedisScripts> implements Adapter {
    private client: RedisClientType<RedisDefaultModules & M, F, S>

    constructor(client: RedisClientType<RedisDefaultModules & M, F, S>) {
        this.client = client
    }

    private async getSessionByKey(sessionKey: string): Promise<DatabaseSession | null> {
        const sessionStr = await this.client.get(sessionKey)
        if (!sessionStr) return null

        const session = superjson.parse<DatabaseSession>(sessionStr)
        if (!session) throw Error('Invalid Session Structure')

        return session
    }

    async getSessionAndUser(sessionId: string): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
        const session = await this.getSessionByKey(getSessionKey(sessionId))

        return [session, session ? { id: session.userId, attributes: {} } : null]
    }
    async getUserSessions(userId: UserId): Promise<DatabaseSession[]> {
        const userSessionsKey = getUserSessionsKey(userId)

        const userSessionKeys = await this.client.sMembers(userSessionsKey)
        return (
            await Promise.all(
                userSessionKeys.map(async (skey) => {
                    try {
                        return await this.getSessionByKey(skey)
                    } catch {
                        return null
                    }
                })
            )
        ).filter((res) => res !== null)
    }
    async setSession(session: DatabaseSession): Promise<void> {
        const sessionKey = getSessionKey(session.id)

        await Promise.all([
            this.client.set(sessionKey, superjson.stringify(session), {
                EX: calcTTL(session.expiresAt),
            }),
            this.client.sAdd(getUserSessionsKey(session.userId), sessionKey),
        ])
    }
    async updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void> {
        const session = await this.getSessionByKey(getSessionKey(sessionId))
        if (!session) return

        session.expiresAt = expiresAt

        await this.setSession(session)
    }
    async deleteSession(sessionId: string): Promise<void> {
        const sessionKey = getSessionKey(sessionId)

        const session = await this.getSessionByKey(sessionKey)
        if (!session) return

        const userSessionsKey = getUserSessionsKey(session.userId)

        await Promise.all([this.client.del(sessionKey), this.client.sRem(userSessionsKey, sessionKey)])
    }
    async deleteUserSessions(userId: UserId): Promise<void> {
        const userSessionsKey = getUserSessionsKey(userId)

        const userSessionKeys = await this.client.sMembers(userSessionsKey)
        await Promise.all([this.client.del(userSessionsKey), this.client.del(userSessionKeys)])
    }
    async deleteExpiredSessions(): Promise<void> {
        const userSessionsKeys: string[] = []
        let cursor = 0
        do {
            const { cursor: newCursor, keys } = await this.client.scan(cursor, {
                MATCH: 'user:*:sessions',
            })
            cursor = newCursor

            userSessionsKeys.push(...keys)
        } while (cursor !== 0)

        await Promise.all(
            userSessionsKeys.map(async (sessionsKey) => {
                const sessionKeys = await this.client.sMembers(sessionsKey)

                await Promise.all(
                    sessionKeys.map(async (sessionKey) => {
                        try {
                            const session = await this.getSessionByKey(sessionKey)
                            if (!session || calcTTL(session.expiresAt) <= 0) await this.client.sRem(sessionsKey, sessionKey)
                        } catch {
                            await this.client.sRem(sessionsKey, sessionKey)
                        }
                    })
                )

                if ((await this.client.sMembers(sessionsKey)).length === 0) await this.client.del(sessionsKey)
            })
        )
    }
}
