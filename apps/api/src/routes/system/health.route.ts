import { Hono } from 'hono'
import { buildSuccess, type ApiMeta } from '@repo/contracts'
import { getApiEnv } from '../../env'

type Bindings = {
  APP_ENV: 'development' | 'test' | 'production'
}

function createMeta(): ApiMeta {
  return {
    requestId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  }
}

const healthRoute = new Hono<{ Bindings: Bindings }>()

healthRoute.get('/', (c) => {
  const env = getApiEnv(c.env)

  return c.json(
    buildSuccess(
      {
        service: 'api',
        env: env.APP_ENV,
      },
      createMeta(),
    ),
  )
})

export default healthRoute