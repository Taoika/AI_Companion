import type {
  ApiResponse,
  OrderDetailResponse,
} from '@repo/contracts'
import { BizCode } from '@repo/contracts'
import { serverURL } from '@/api/client'

export async function getOrderDetail(): Promise<ApiResponse<OrderDetailResponse>> {
  try {
    const response = await fetch(serverURL('/rpc/order'))

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
    }
  }
}