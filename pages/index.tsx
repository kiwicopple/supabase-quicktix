import { GetStaticProps } from 'next'
import Head from 'next/head'
import { dehydrate, QueryClient } from 'react-query'
import Layout from '../components/Layout'
import Movie from '../components/Movie'
import { getMovies, useMoviesQuery } from '../lib/data/movies'
import { NextPageWithLayout } from '../lib/types'

const IndexPage: NextPageWithLayout = () => {
  const { data } = useMoviesQuery()

  return (
    <>
      <Head>
        <title>Movies | QuickTix</title>
      </Head>

      <div className="mb-12 space-y-8">
        <h2 className="font-bold text-lg">QuickTix</h2>

        <div className="flex justify-start">
          {data?.movies.map((movie) => (
            <Movie key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </>
  )
}

IndexPage.getLayout = (page) => <Layout>{page}</Layout>

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(['movies'], ({ signal }) => getMovies(signal))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60,
  }
}

export default IndexPage
