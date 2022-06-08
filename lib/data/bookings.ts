import { PostgrestError } from '@supabase/supabase-js'
import { useCallback } from 'react'
import { useQuery, useQueryClient, UseQueryOptions } from 'react-query'
import { useUser } from '../auth'
import supabase from '../supabase'
import { MovieWithSeats } from './movies'
import { NotFoundError, NotImplementedError } from './utils'

/* Get My Bookings */

export async function getMyBookings(
  userId: string | undefined,
  signal?: AbortSignal
): Promise<{
  bookings: MovieWithSeats[]
}> {
  if (typeof userId === 'undefined') {
    throw new Error('Invalid User ID')
  }

  let query = supabase
    .from<MovieWithSeats>('movies')
    .select(`*,seats!inner(*)`)
    // Fix for this coming soon!
    // @ts-ignore
    .eq('seats.reserved_by_user_id', userId)

  if (signal) {
    query = query.abortSignal(signal)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  if (!data) {
    throw new NotFoundError('My Bookings not found')
  }

  return { bookings: data }
}

export type MyBookingsData = Awaited<ReturnType<typeof getMyBookings>>
export type MyBookingsError =
  | PostgrestError
  | NotFoundError
  | NotImplementedError

export const useMyBookingsQuery = ({
  enabled = true,
  ...options
}: UseQueryOptions<MyBookingsData, MyBookingsError> = {}) => {
  const user = useUser()

  const _enabled = enabled && typeof user?.id !== 'undefined'

  const { isLoading, isIdle, ...rest } = useQuery<
    MyBookingsData,
    MyBookingsError
  >(['bookings', user?.id], ({ signal }) => getMyBookings(user?.id, signal), {
    enabled: _enabled,
    ...options,
  })

  // fake the loading state if we're not enabled
  return {
    isLoading: (!_enabled && isIdle) || isLoading,
    isIdle,
    ...rest,
  }
}

export const useBookingsPrefetch = () => {
  const user = useUser()
  const client = useQueryClient()

  return useCallback(() => {
    if (user?.id) {
      client.prefetchQuery(['bookings', user.id], ({ signal }) =>
        getMyBookings(user?.id, signal)
      )
    }
  }, [user?.id])
}
