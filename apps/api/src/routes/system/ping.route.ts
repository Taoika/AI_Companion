import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { flattenError } from 'zod/v4/core'
import {
  BizCode,
  PingRequestSchema,
  buildFailure,
  buildSuccess,
  type ApiMeta,
} from '@repo/contracts'
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

const pingRoute = new Hono<{ Bindings: Bindings }>()

pingRoute.post(
  '/',
  zValidator('json', PingRequestSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        buildFailure(
          {
            code: BizCode.COMMON_INVALID_REQUEST,
            message: 'Invalid request payload',
            details: flattenError(result.error),
          },
          createMeta(),
        ),
        400,
      )
    }
  }),
  (c) => {
    const payload = c.req.valid('json')
    const env = getApiEnv(c.env)

    return c.json(
      buildSuccess(
        {
          service: 'api',
          message: `pong, ${payload.name}`,
          env: env.APP_ENV,
        },
        createMeta(),
      ),
    )
  },
)

export default pingRoute