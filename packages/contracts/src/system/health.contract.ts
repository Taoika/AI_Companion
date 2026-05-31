import { z } from 'zod'

// Health 响应的 schema
export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string(),
})

// 从 schema 推导类型
export type HealthResponse = z.infer<typeof HealthResponseSchema>
