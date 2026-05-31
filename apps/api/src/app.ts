import {
  BizCode,
  PingRequestSchema,
  buildFailure,
  buildSuccess,
  type ApiMeta,
} from '@repo/contracts'
import { zValidator } from '@hono/zod-validator'
import { flattenError } from 'zod/v4/core'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { getApiEnv } from './env'

type AppErrorStatus = 400 | 401 | 403 | 404 | 409 | 422 | 500 | 504

class AppError extends Error {
  constructor(
    readonly code: BizCode,
    message: string,
    readonly status: AppErrorStatus,
    readonly details?: unknown,
  ) {
    super(message)
  }
}

const app = new Hono<{
  Bindings: {
    APP_ENV: 'development' | 'test' | 'production'
  }
}>()

function createMeta(): ApiMeta {
  return {
    requestId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  }
}

// ---------------------------------------------------------------------------
// Global error handling
// ---------------------------------------------------------------------------

app.onError((error, c) => {
  const meta = createMeta()

  if (error instanceof AppError) {
    return c.json(
      buildFailure({ code: error.code, message: error.message, details: error.details }, meta),
      error.status,
    )
  }

  if (error instanceof HTTPException) {
    return c.json(
      buildFailure({ code: BizCode.COMMON_INVALID_REQUEST, message: error.message }, meta),
      error.status,
    )
  }

  console.error(error)
  return c.json(
    buildFailure({ code: BizCode.SYSTEM_INTERNAL_ERROR, message: 'Internal server error' }, meta),
    500,
  )
})

app.notFound((c) =>
  c.json(buildFailure({ code: BizCode.COMMON_NOT_FOUND, message: 'Not found' }, createMeta()), 404),
)

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

const routes = app
  .get('/health', (c) => {
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
  .post(
    '/rpc/system/ping',
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

export type AppType = typeof routes

export default app
