import Head from 'next/head'
import { useCallback, useState } from 'react'
import ErrorDisplay from '../components/ErrorDisplay'
import Layout from '../components/Layout'
import Seats from '../components/Seats'
import { Seat, useMovieQuery } from '../lib/data/movies'
import {
  useReserveSeatsMutation,
  useSeatsSubscription,
} from '../lib/data/seats'
import { useParams } from '../lib/data/utils'
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
      setSelectedSeatIds(new Set())
    },
    onError(error) {
      if (
        error.code === 'RSRVD' ||
        error.code === 'TOMNY' ||
        error.code === 'AUTHN'
      ) {
        alert(error.message)
        return
      }

      console.error(error)
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
        <h2 className="font-bold text-lg">{data?.movie.title}</h2>

        {isError && <ErrorDisplay error={error} />}

        {isSuccess && (
          <div className="flex flex-col items-center gap-6">
            <Seats
              seats={data.movie.seats}
              selectedSeatIds={selectedSeatIds}
              handleSeatClick={handleSeatClick}
            />

            <hr className="flex self-stretch" />

            <div className="flex flex-col gap-2 self-stretch">
              <button
                onClick={onReserve}
                disabled={selectedSeatIds.size <= 0 || isReserving}
                className="cursor-pointer rounded border px-4 py-2 disabled:cursor-default disabled:bg-gray-100"
              >
                {isReserving ? 'Reserving...' : 'Reserve'}{' '}
                {selectedSeatIds.size} Seats
              </button>
              <p className="text-gray-700 text-xs">Max 3 seats per booking</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

IndexPage.getLayout = (page) => <Layout>{page}</Layout>

export default IndexPage
