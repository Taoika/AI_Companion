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

const userRoute = new Hono<{ Bindings: Bindings }>()

userRoute.get('/', (c) => {
  // 模拟用户资料数据
  const profile = {
    id: 'user-123',
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://example.com/avatar.jpg',
    createdAt: '2024-01-01T00:00:00Z',
  }

  return c.json(
    buildSuccess(
      profile,
      createMeta(),
    ),
  )
})

export default userRoute