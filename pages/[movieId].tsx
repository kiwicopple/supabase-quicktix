import { useCallback, useState } from 'react'
import Layout from '../components/Layout'
import Seats from '../components/Seats'
import { useMovieQuery } from '../lib/data/movies'
import { useReserveSeatsMutation } from '../lib/data/seats'
import { useParams } from '../lib/data/utils'
import { NextPageWithLayout } from '../lib/types'

const IndexPage: NextPageWithLayout = () => {
  const { movieId } = useParams()
  const { data, isSuccess } = useMovieQuery(movieId)

  const [selectedSeatIds, setSelectedSeatIds] = useState<Set<string>>(
    () => new Set<string>()
  )

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
      if (error.code === 'RSRVD') {
        alert(error.message)
      }
    },
  })
  const onReserve = useCallback(() => {
    mutate({ seatIds: Array.from(selectedSeatIds), movieId })
  }, [selectedSeatIds, movieId])

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">{data?.movie.title}</h2>

      {isSuccess && (
        <>
          <Seats
            seats={data.movie.seats}
            selectedSeatIds={selectedSeatIds}
            handleSeatClick={handleSeatClick}
          />

          <hr />

          <div>
            <button
              onClick={onReserve}
              disabled={selectedSeatIds.size <= 0 || isReserving}
              className="cursor-pointer rounded border px-4 py-2 disabled:cursor-default disabled:bg-gray-100"
            >
              Reserve {selectedSeatIds.size} Seats
            </button>
          </div>
        </>
      )}
    </div>
  )
}

IndexPage.getLayout = (page) => <Layout>{page}</Layout>

export default IndexPage
