import { PostgrestError } from '@supabase/supabase-js'
import { useEffect } from 'react'
import { useMutation, UseMutationOptions, useQueryClient } from 'react-query'
import supabase from '../supabase'
import { MovieData, Seat } from './movies'

/* Seats Subscription */

export const useSeatsSubscription = (
  movieId: string | undefined,
  onUpdate?: (updatedSeat: Seat) => void
) => {
  const client = useQueryClient()

  useEffect(() => {
    let subscription = supabase
      .from<Seat>('seats')
      .on('UPDATE', (payload) => {
        onUpdate?.(payload.new)

        if (movieId) {
          client.setQueryData<MovieData | undefined>(
            ['movie', movieId],
            (previous) => {
              if (!previous) {
                return
              }

              const updatedSeat = payload.new

              return {
                ...previous,
                movie: {
                  ...previous.movie,
                  seats: previous.movie.seats.map((seat) =>
                    seat.id === updatedSeat.id ? updatedSeat : seat
                  ),
                },
              }
            }
          )
        }
      })
      .subscribe()

    return () => {
      supabase.removeSubscription(subscription)
    }
  }, [movieId, onUpdate])
}

/* Reserve Seats */

type ReserveSeatsVariables = {
  movieId?: string
  seatIds: string[]
}

export async function reserveSeats(
  { seatIds }: ReserveSeatsVariables,
  signal?: AbortSignal
) {
  let query = supabase.rpc<boolean>('reserve_seats', { seat_ids: seatIds })

  if (signal) {
    query = query.abortSignal(signal)
  }

  let { data, error } = await query.single()

  if (error) {
    throw error
  }

  return data ?? false
}

type ReserveSeatsData = Awaited<ReturnType<typeof reserveSeats>>
type ReserveSeatsError = PostgrestError

export const useReserveSeatsMutation = ({
  onSuccess,
  ...options
}: Omit<
  UseMutationOptions<
    ReserveSeatsData,
    ReserveSeatsError,
    ReserveSeatsVariables
  >,
  'mutationFn'
> = {}) => {
  const queryClient = useQueryClient()

  return useMutation<
    ReserveSeatsData,
    ReserveSeatsError,
    ReserveSeatsVariables
  >((args) => reserveSeats(args), {
    async onSuccess(data, variables, context) {
      if (variables.movieId) {
        await queryClient.invalidateQueries(['movie', variables.movieId])
      }

      await onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
