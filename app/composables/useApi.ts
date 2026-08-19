import type { ApiResponse } from '~/types'

/**
 * Typed wrapper around $fetch for Nuxt server API routes.
 */
export const useApi = () => {
  const get = async <T>(url: string, query?: Record<string, string | number | boolean>) => {
    return $fetch<ApiResponse<T>>(url, { method: 'GET', query })
  }

  const post = async <T>(url: string, body?: unknown) => {
    return $fetch<ApiResponse<T>>(url, { method: 'POST', body })
  }

  return { get, post }
}
