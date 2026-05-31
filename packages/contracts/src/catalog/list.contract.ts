import { z } from 'zod'

// 目录列表响应的 schema
export const CatalogListResponseSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
    }),
  ),
})

// 从 schema 推导类型
export type CatalogListResponse = z.infer<typeof CatalogListResponseSchema>