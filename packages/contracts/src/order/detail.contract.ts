import { z } from 'zod'

// 订单详情响应的 schema
export const OrderDetailResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    }),
  ),
  totalAmount: z.number().positive(),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  createdAt: z.string().datetime(),
})

// 从 schema 推导类型
export type OrderDetailResponse = z.infer<typeof OrderDetailResponseSchema>