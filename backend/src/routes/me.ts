import { Hono } from 'hono'
import { requireAuth, type AuthVariables } from '../middlewares/auth'

export const meRoutes = new Hono<{ Variables: AuthVariables }>()
  .use('*', requireAuth)
  .get('/', (c) => {
    const u = c.get('user')
    return c.json({
      data: {
        id: u.id,
        name: u.name,
        email: u.email,
        emailVerified: u.emailVerified,
        role: u.role,
        image: u.image,
        createdAt: u.createdAt
      }
    })
  })
