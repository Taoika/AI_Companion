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

const orderRoute = new Hono<{ Bindings: Bindings }>()

orderRoute.get('/', (c) => {
  // 模拟订单详情数据
  const order = {
    id: 'order-456',
    userId: 'user-123',
    items: [
      { productId: '1', name: '示例商品1', quantity: 2, price: 99.99 },
      { productId: '2', name: '示例商品2', quantity: 1, price: 199.99 },
    ],
    totalAmount: 399.97,
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
  }

  return c.json(
    buildSuccess(
      order,
      createMeta(),
    ),
  )
})

export default orderRoute