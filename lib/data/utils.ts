import { useRouter } from 'next/router'

export class NotFoundError extends Error {}

export const DEFAULT_PAGE_SIZE = 20

export function getPagination(page?: number, size: number = DEFAULT_PAGE_SIZE) {
  const limit = size
  const from = page ? page * limit : 0
  const to = page ? from + size - 1 : size - 1

  return { from, to }
}

export function useParam(key: string) {
  const { query } = useRouter()

  const param = query[key]

  if (Array.isArray(param)) {
    return param[0]
  } else {
    return param
  }
}
