import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import Seats from '../components/Seats'
import { useMovieQuery } from '../lib/data/movies'
import { useParam } from '../lib/data/utils'
import { NextPageWithLayout } from '../lib/types'

const IndexPage: NextPageWithLayout = () => {
  const movieId = useParam('movieId')
  const { data, isSuccess } = useMovieQuery(movieId)

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">{data?.movie.title}</h2>

      {isSuccess && <Seats seats={data.movie.seats} />}
    </div>
  )
}

IndexPage.getLayout = (page) => <Layout>{page}</Layout>

export default IndexPage
