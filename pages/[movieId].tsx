import { CursorClickIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import ErrorDisplay from '../components/ErrorDisplay'
import Layout from '../components/Layout'
import Seats from '../components/Seats'
import SeatsSkeleton from '../components/SeatsSkeleton'
import { Seat, useMovieQuery } from '../lib/data/movies'
import {
  useReserveSeatsMutation,
  useSeatsSubscription,
} from '../lib/data/seats'
import { NotImplementedError, useParams } from '../lib/data/utils'
import { NextPageWithLayout } from '../lib/types'

const IndexPage: NextPageWithLayout = () => {
  const { movieId } = useParams()
  const { data, isSuccess, isLoading, isError, error } = useMovieQuery(movieId)

  const [selectedSeatIds, setSelectedSeatIds] = useState<Set<string>>(
    () => new Set<string>()
  )

  const onSeatUpdate = useCallback((seat: Seat) => {
    setSelectedSeatIds((prev) => {
      if (prev.has(seat.id)) {
        prev.delete(seat.id)

        return new Set(prev)
      }

      return prev
    })
  }, [])

  useSeatsSubscription(data?.movie.id, onSeatUpdate)

  const handleSeatClick = useCallback(
    (seatId: string) => {
      if (selectedSeatIds.has(seatId)) {
        selectedSeatIds.delete(seatId)
        setSelectedSeatIds(new Set(selectedSeatIds))
      } else {
        selectedSeatIds.add(seatId)
        setSelectedSeatIds(new Set(selectedSeatIds))
      }
    },
    [selectedSeatIds]
  )

  const { mutate, isLoading: isReserving } = useReserveSeatsMutation({
    onSuccess() {
      toast.success('Your seats have been reserved!')

      setSelectedSeatIds(new Set())
    },
    onError(error) {
      if (error instanceof NotImplementedError) {
        toast.error(error.message)
        return
      }

      if (
        error.code === 'RSRVD' ||
        error.code === 'TOMNY' ||
        error.code === 'AUTHN'
      ) {
        alert(error.message)
        return
      }
    },
  })
  const onReserve = useCallback(() => {
    mutate({ seatIds: Array.from(selectedSeatIds), movieId })
  }, [selectedSeatIds, movieId])

  return (
    <>
      <Head>
        <title>{data?.movie.title ?? 'Loading...'} | QuickTix</title>
      </Head>

      <div className="mb-12 space-y-8">
        {isLoading && (
          <div>
            <div className="h-1" />
            <div className="h-5 w-[40%] animate-pulse rounded bg-gray-200" />
            <div className="h-1" />
          </div>
        )}
        {isSuccess && (
          <h2 className="font-bold text-lg">{data?.movie.title}</h2>
        )}

        {isError && <ErrorDisplay error={error} />}

        <div className="flex flex-col items-end gap-6">
          {isLoading && <SeatsSkeleton />}

          {isSuccess && (
            <Seats
              seats={data.movie.seats}
              selectedSeatIds={selectedSeatIds}
              handleSeatClick={handleSeatClick}
            />
          )}

          <hr className="flex self-stretch" />

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={onReserve}
              disabled={selectedSeatIds.size <= 0 || isReserving || !isSuccess}
              className="flex cursor-pointer items-center rounded border px-4 py-2 disabled:cursor-default disabled:bg-gray-100"
            >
              <CursorClickIcon className="mr-2 h-4 w-4" />{' '}
              {isReserving ? 'Reserving...' : 'Reserve'} {selectedSeatIds.size}{' '}
              Seats
            </button>
            <p className="text-gray-700 text-xs">Max 3 seats per booking</p>
          </div>
        </div>
      </div>
    </>
  )
}

IndexPage.getLayout = (page) => <Layout>{page}</Layout>

export default IndexPage
