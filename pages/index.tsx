import Layout from '../components/Layout'
import Movie from '../components/Movie'
import { useMoviesQuery } from '../lib/data/movies'
import { NextPageWithLayout } from '../lib/types'

const IndexPage: NextPageWithLayout = () => {
  const { data } = useMoviesQuery()

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">QuickTix</h2>

      <div className="flex justify-start">
        {data?.movies.map((movie) => (
          <Movie key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}

IndexPage.getLayout = (page) => <Layout>{page}</Layout>

export default IndexPage
