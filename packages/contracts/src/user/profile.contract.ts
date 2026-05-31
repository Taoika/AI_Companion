import { z } from 'zod'

// 用户资料响应的 schema
export const UserProfileResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url(),
  createdAt: z.string().datetime(),
})

// 从 schema 推导类型
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>