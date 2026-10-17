import type { Product, ProductsResponse } from './types'
const API_BASE = 'https://dummyjson.com/products'
const PAGE_SIZE = 8
async function request<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return response.json() as Promise<T>
}
export async function getProducts({ query, page }: { query: string; page: number }): Promise<ProductsResponse> {
  const params = new URLSearchParams({ limit: String(PAGE_SIZE), skip: String((page - 1) * PAGE_SIZE) })
  const endpoint = query.trim() ? `${API_BASE}/search?q=${encodeURIComponent(query.trim())}&${params}` : `${API_BASE}?${params}`
  return request<ProductsResponse>(endpoint)
}
export function getProductById(id: string): Promise<Product> { return request<Product>(`${API_BASE}/${encodeURIComponent(id)}`) }
export { PAGE_SIZE }
