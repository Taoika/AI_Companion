import type {
  ApiResponse,
  UserProfileResponse,
} from '@repo/contracts'
import { BizCode } from '@repo/contracts'
import { serverURL } from '@/api/client'

export async function getUserProfile(): Promise<ApiResponse<UserProfileResponse>> {
  try {
    const response = await fetch(serverURL('/rpc/user'))

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