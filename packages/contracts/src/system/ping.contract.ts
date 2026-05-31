import { z } from 'zod'

// Ping 请求和响应的 schema
export const PingRequestSchema = z.object({
  name: z.string().trim().min(1),
})

export const PingResponseSchema = z.object({
  service: z.literal('api'),
  message: z.string(),
})

// 从 schema 推导类型
export type PingRequest = z.infer<typeof PingRequestSchema>
export type PingResponse = z.infer<typeof PingResponseSchema>