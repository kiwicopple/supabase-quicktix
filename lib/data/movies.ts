import { PostgrestError } from '@supabase/supabase-js'
import { useCallback } from 'react'
import { useQuery, useQueryClient, UseQueryOptions } from 'react-query'
import supabase from '../supabase'
import { NotFoundError } from './utils'

export type Movie = {
  id: string
  created_at: string
  updated_at: string
  title: string
  thumbnail_url: string | null
}

export type Seat = {
  id: string
  created_at: string
  updated_at: string
  movie_id: string
  row: string
  number: number
  reserved_by_user_id: string | null
}

export type MovieWithSeats = Movie & {
  seats: Seat[]
}

/* Get Movies */

export async function getMovies(signal?: AbortSignal) {
  let query = supabase.from<Movie>('movies').select(`*`)

  if (signal) {
    query = query.abortSignal(signal)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  if (!data) {
    throw new NotFoundError('Movies not found')
  }

  return { movies: data }
}

export type MoviesData = Awaited<ReturnType<typeof getMovies>>
export type MoviesError = PostgrestError

export const useMoviesQuery = (
  options?: UseQueryOptions<MoviesData, MoviesError>
) =>
  useQuery<MoviesData, MoviesError>(
    ['movies'],
    ({ signal }) => getMovies(signal),
    options
  )

/* Get Movie */

export async function getMovie(id: string | undefined, signal?: AbortSignal) {
  if (typeof id === 'undefined') {
    throw new Error('Invalid ID')
  }

  let query = supabase
    .from<MovieWithSeats>('movies')
    .select(`*,seats(*)`)
    .eq('id', id)

  if (signal) {
    query = query.abortSignal(signal)
  }

  const { data, error } = await query.maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    throw new NotFoundError('Movie not found')
  }

  return { movie: data }
}

export type MovieData = Awaited<ReturnType<typeof getMovie>>
export type MovieError = PostgrestError

export const useMovieQuery = (
  id: string | undefined,
  { enabled = true, ...options }: UseQueryOptions<MovieData, MovieError> = {}
) => {
  const _enabled = enabled && typeof id !== 'undefined'

  const { isLoading, isIdle, ...rest } = useQuery<MovieData, MovieError>(
    ['movie', id],
    ({ signal }) => getMovie(id, signal),
    {
      enabled: _enabled,
      // we're increasing the staleTime to 5 minutes here as we're using realtime
      // to update the seats
      staleTime: 300000,
      ...options,
    }
  )

  // fake the loading state if we're not enabled
  return {
    isLoading: (!_enabled && isIdle) || isLoading,
    isIdle,
    ...rest,
  }
}

export const useMoviePrefetch = (id: string | undefined) => {
  const client = useQueryClient()
  return useCallback(() => {
    if (id) {
      client.prefetchQuery(['movie', id], ({ signal }) => getMovie(id, signal))
    }
  }, [id])
}
