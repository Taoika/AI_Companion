import type { AppType } from '@repo/api'
import {
  BizCode,
  type ApiResponse,
  type PingResponse,
} from '@repo/contracts'
import { Button } from '@repo/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/card'
import { Input } from '@repo/ui/input'
import { Label } from '@repo/ui/label'
import { Separator } from '@repo/ui/separator'
import { TailwindDemo } from '@repo/ui/tailwind-demo'
import { hc, type InferResponseType } from 'hono/client'
import { getWebServerEnv } from '../src/env.server'
import { WebEnvBadge } from '../src/web-env-badge'

type PingRpcResponse = InferResponseType<
  ReturnType<typeof hc<AppType>>['rpc']['system']['ping']['$post']
>

const rpcPayload = { name: 'web' } as const

async function getPingResponse(apiBaseUrl: string): Promise<PingRpcResponse> {
  const client = hc<AppType>(apiBaseUrl)

  try {
    const response = await client.rpc.system.ping.$post({
      json: rpcPayload,
    })

    return await response.json()
  } catch (error) {
    return {
      ok: false,
      error: {
        code: BizCode.SYSTEM_UPSTREAM_TIMEOUT,
        message: error instanceof Error ? error.message : 'API request failed',
      },
      meta: {
        requestId: 'unavailable',
        timestamp: new Date().toISOString(),
      },
    } satisfies ApiResponse<PingResponse>
  }
}

export default async function Home() {
  const env = getWebServerEnv()
  const pingResult = await getPingResponse(env.API_BASE_URL)
  const requestBody = JSON.stringify(rpcPayload, null, 2)
  const responseBody = JSON.stringify(pingResult, null, 2)

  return (
    <>
      <TailwindDemo appName="web" />

      <section className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border border-border px-3 py-1">
          server {env.APP_ENV}
        </span>
        <span className="rounded-full border border-border px-3 py-1">
          {env.API_BASE_URL}
        </span>
        <WebEnvBadge />
      </section>

      <section className="py-10">
        <Card className="overflow-hidden border border-border bg-background shadow-soft">
          <CardContent className="space-y-5 p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                RPC validation
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Shared request and response contract
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-border px-3 py-1">
                POST /rpc/system/ping
              </span>
              <span className="rounded-full border border-border px-3 py-1">
                {pingResult.ok ? 'ok=true' : `code=${pingResult.error.code}`}
              </span>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-sm font-medium text-foreground">Request</p>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all text-xs leading-6 text-muted-foreground">
                  {requestBody}
                </pre>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-sm font-medium text-foreground">Response</p>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all text-xs leading-6 text-muted-foreground">
                  {responseBody}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Primitive validation in web</CardTitle>
          <CardDescription>
            This section imports shared Button, Input, Label, Card, and Separator components directly from <code className="rounded bg-white/10 px-2 py-1 text-slate-100">@repo/ui</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input id="project-name" placeholder="AI Agent workspace" />
          </div>
          <Separator />
          <div className="flex flex-wrap gap-3">
            <Button>Save draft</Button>
            <Button variant="secondary">Preview</Button>
            <Button variant="outline">Open docs</Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
