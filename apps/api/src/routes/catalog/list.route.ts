import { Hono } from 'hono'
import { buildSuccess, type ApiMeta } from '@repo/contracts'

type Bindings = {
  APP_ENV: 'development' | 'test' | 'production'
}

function createMeta(): ApiMeta {
  return {
    requestId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  }
}

const catalogRoute = new Hono<{ Bindings: Bindings }>()

catalogRoute.get('/', (c) => {
  // 模拟目录列表数据
  const items = [
    { id: '1', name: '示例商品1', category: '电子产品' },
    { id: '2', name: '示例商品2', category: '家居用品' },
    { id: '3', name: '示例商品3', category: '图书音像' },
  ]

  return c.json(
    buildSuccess(
      { items },
      createMeta(),
    ),
  )
})

export default catalogRoute