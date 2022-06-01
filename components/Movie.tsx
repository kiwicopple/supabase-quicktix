import { ArrowRightIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { Movie } from '../lib/data/movies'

type MovieProps = {
  movie: Movie
}

const Movie = ({ movie }: MovieProps) => {
  return (
    <Link href={`/${movie.id}`}>
      <a className="flex flex-col overflow-hidden rounded shadow">
        {movie.thumbnail_url ? (
          <img
            className="aspect-[2/3] h-[300px] bg-gray-300"
            src={movie.thumbnail_url}
            alt={movie.title}
          />
        ) : (
          <div className="aspect-[2/3] h-[300px] bg-gray-300" />
        )}

        <div className="flex items-center justify-between rounded-b border-b border-l border-r border-gray-200 p-2">
          <h3 className="font-medium text-lg">{movie.title}</h3>

          <ArrowRightIcon className="h-5 w-5" />
        </div>
      </a>
    </Link>
  )
}

export default Movie