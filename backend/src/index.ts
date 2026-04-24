import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { Scalar } from '@scalar/hono-api-reference'
import { routes, publicRoutes } from './routes/index'
import { auth } from './lib/auth'
import { errorHandler } from './middlewares/error-handler'
const app = new OpenAPIHono()

app.use('*', logger())
app.use(
  '*',
  cors({
    origin: [
      process.env.FRONTEND_URL ?? 'http://localhost:5173',
      process.env.ADMIN_URL ?? 'http://localhost:5174'
    ],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
)

app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw))

app.route('/api/public', publicRoutes)
app.route('/api', routes)

app.get('/', (c) =>
  c.json({ service: "Break'Distrib API", version: '1.0.0', status: 'ok' })
)

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: { title: "Break'Distrib API", version: '1.0.0' }
})

app.get('/docs', Scalar({ url: '/openapi.json' }))

app.onError(errorHandler)
export { app }
export default {
  port: process.env.PORT ?? 3000,
  fetch: app.fetch
}
