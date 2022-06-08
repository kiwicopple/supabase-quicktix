import { ArrowRightIcon } from '@heroicons/react/solid'
import Image from 'next/image'
import Link from 'next/link'
import { Movie, useMoviePrefetch } from '../lib/data/movies'

type MovieProps = {
  movie: Movie
}

const Movie = ({ movie }: MovieProps) => {
  const prefetchMovie = useMoviePrefetch(movie.id)

  return (
    <Link href={`/${movie.id}`}>
      <a
        className="flex flex-col overflow-hidden rounded shadow"
        onMouseEnter={prefetchMovie}
      >
        {movie.thumbnail_url ? (
          <Image
            width={200}
            height={300}
            className="bg-gray-300"
            src={movie.thumbnail_url}
            alt={movie.title}
          />
        ) : (
          <div className="aspect-[2/3] h-[300px] bg-gray-300" />
        )}

        <div className="flex items-center justify-between gap-2 rounded-b border-b border-l border-r border-gray-200 p-2">
          <h3 className="w-[150px] overflow-hidden overflow-ellipsis whitespace-nowrap font-medium text-lg">
            {movie.title}
          </h3>

          <ArrowRightIcon className="h-5 w-5 flex-shrink-0" />
        </div>
      </a>
    </Link>
  )
}

export default Movie
