import { z } from 'zod'
import { asc, desc, type SQL, type AnyColumn } from 'drizzle-orm'

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().min(1).optional(),
  sort: z.string().trim().min(1).optional()
})

export type PaginationParams = z.infer<typeof paginationSchema>

export type PaginationMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export function paginate(params: PaginationParams): { limit: number; offset: number } {
  return {
    limit: params.pageSize,
    offset: (params.page - 1) * params.pageSize
  }
}

export function buildMeta(params: PaginationParams, total: number): PaginationMeta {
  return {
    page: params.page,
    pageSize: params.pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / params.pageSize))
  }
}

export function parseSort<T extends Record<string, AnyColumn>>(
  raw: string | undefined,
  columns: T,
  fallback: keyof T
): SQL {
  if (!raw) return desc(columns[fallback]!)
  const [colRaw, dirRaw] = raw.split(':')
  if (!colRaw) return desc(columns[fallback]!)
  const col = columns[colRaw]
  if (!col) return desc(columns[fallback]!)
  return dirRaw === 'asc' ? asc(col) : desc(col)
}
