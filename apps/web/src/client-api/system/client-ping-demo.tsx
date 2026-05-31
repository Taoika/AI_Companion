"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getClientHealth } from '@/client-api/system/health.api'
import { postClientPing } from '@/client-api/system/ping.api'

const HEALTH_QUERY_KEY = ['system-health']

export function ClientPingDemo() {
  const queryClient = useQueryClient()

  // 获取数据
  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: HEALTH_QUERY_KEY,
    queryFn: getClientHealth,
  })

  // 发送请求
  const pingMutation = useMutation({
    mutationFn: () => postClientPing({ name: 'client-web' }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEY })
    },
  })

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">TanStack Query Demo</h2>

      {/* Health Query 状态 */}
      <div className="p-4 rounded-lg border">
        <h3 className="font-semibold mb-2">Health Query</h3>
        {isLoading && <p className="text-blue-500">Loading...</p>}
        {isError && <p className="text-red-500">Error: {error?.message}</p>}
        {isSuccess && (
          <div className="text-green-500">
            <p>Status: {data?.ok ? 'OK' : 'Failed'}</p>
            {data?.ok && <p>Service: {data.data.status}</p>}
          </div>
        )}
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refetch
        </button>
      </div>

      {/* Ping Mutation */}
      <div className="p-4 rounded-lg border">
        <h3 className="font-semibold mb-2">Ping Mutation</h3>
        <button
          onClick={() => pingMutation.mutate()}
          disabled={pingMutation.isPending}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {pingMutation.isPending ? 'Pinging...' : 'Send Ping'}
        </button>
        {pingMutation.isSuccess && (
          <p className="mt-2 text-green-500">Ping successful!</p>
        )}
        {pingMutation.isError && (
          <p className="mt-2 text-red-500">Ping failed: {pingMutation.error?.message}</p>
        )}
      </div>
    </div>
  )
}
