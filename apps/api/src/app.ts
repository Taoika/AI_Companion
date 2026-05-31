import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { BizCode, buildFailure, type ApiMeta } from '@repo/contracts'
import routes from './routes'

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

type Bindings = {
  APP_ENV: 'development' | 'test' | 'production'
}

const app = new Hono<{ Bindings: Bindings }>()

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
// Mount routes
// ---------------------------------------------------------------------------

app.route('/', routes)

export type AppType = typeof routes

export default app