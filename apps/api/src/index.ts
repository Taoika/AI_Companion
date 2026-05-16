import { Hono } from 'hono'

const app = new Hono()

app.get('/health', (c) => {
  return c.json({ message: 'Hello Hono!', ok: true, service: 'api' })
})

export default app
