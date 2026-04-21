import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { routes } from './routes/index'

const app = new Hono()

app.use('*', logger())
app.use(
  '*',
  cors({
    origin: [
      process.env.FRONTEND_URL ?? 'http://localhost:5173',
      process.env.ADMIN_URL ?? 'http://localhost:5174'
    ],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization']
  })
)

app.route('/api', routes)

app.get('/', (c) =>
  c.json({ service: "Break'Distrib API", version: '1.0.0', status: 'ok' })
)

export default {
  port: process.env.PORT ?? 3000,
  fetch: app.fetch
}
