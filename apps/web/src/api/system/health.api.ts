import { http } from '@/http'

export function getHealth() {
  return http.get<{ service: string; env: string }>('/health')
}
