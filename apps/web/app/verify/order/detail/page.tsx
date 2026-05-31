import { getOrderDetail } from '@/api/order/detail.api'
import {
  Card,
  CardContent,
} from '@repo/ui/card'

export default async function OrderDetailVerifyPage() {
  const result = await getOrderDetail()
  const responseBody = JSON.stringify(result, null, 2)

  return (
    <section className="py-10">
      <Card className="overflow-hidden border border-border bg-background shadow-soft">
        <CardContent className="space-y-5 p-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              API 验证
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              订单详情
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border px-3 py-1">
              GET /rpc/order
            </span>
            <span className="rounded-full border border-border px-3 py-1">
              {result.ok ? 'ok=true' : `code=${result.error.code}`}
            </span>
          </div>
          <div className="rounded-2xl border border-border bg-muted/40 p-4">
            <p className="text-sm font-medium text-foreground">Response</p>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all text-xs leading-6 text-muted-foreground">
              {responseBody}
            </pre>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}