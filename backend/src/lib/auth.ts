import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db/client'
import { user, session, account, verification } from '../db/schema/index'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { user, session, account, verification }
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  trustedOrigins: [
    process.env.FRONTEND_URL ?? 'http://localhost:5173',
    process.env.ADMIN_URL ?? 'http://localhost:5174'
  ]
})

export type Auth = typeof auth
