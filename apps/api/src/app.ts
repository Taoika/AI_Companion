import {
  BizCode,
  PingRequestSchema,
  buildFailure,
  buildSuccess,
  type ApiMeta,
} from '@repo/contracts'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { validator } from 'hono/validator'

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

const app = new Hono()

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
  .get('/health', (c) => c.json(buildSuccess({ service: 'api' }, createMeta())))
  .post(
    '/rpc/system/ping',
    validator('json', (value, c) => {
      const parsed = PingRequestSchema.safeParse(value)

      if (!parsed.success) {
        return c.json(
          buildFailure(
            { code: BizCode.COMMON_INVALID_REQUEST, message: 'Invalid request payload', details: parsed.error.flatten() },
            createMeta(),
          ),
          400,
        )
      }

      return parsed.data
    }),
    (c) => {
      const payload = c.req.valid('json')
      return c.json(buildSuccess({ service: 'api', message: `pong, ${payload.name}` }, createMeta()))
    },
  )

export type AppType = typeof routes

export default app
