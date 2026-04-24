import type { MiddlewareHandler } from 'hono'
import { eq } from 'drizzle-orm'
import { auth } from '../lib/auth'
import { db } from '../db/client'
import { user as userTable } from '../db/schema/index'
import type { Session, User } from '../db/schema/index'

export type UserRole = User['role']

export type AuthVariables = {
  user: User
  session: Session
}

export const requireAuth: MiddlewareHandler<{ Variables: AuthVariables }> = async (c, next) => {
  const data = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!data) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const [u] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, data.user.id))
    .limit(1)

  if (!u) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  c.set('user', u)
  c.set('session', data.session as unknown as Session)
  await next()
}

export const requireRole = (
  ...allowed: UserRole[]
): MiddlewareHandler<{ Variables: AuthVariables }> => {
  return async (c, next) => {
    const u = c.get('user')
    if (!u || !allowed.includes(u.role)) {
      return c.json({ error: 'Forbidden' }, 403)
    }
    await next()
  }
}
