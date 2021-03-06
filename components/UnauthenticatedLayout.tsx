import Link from 'next/link'
import { PropsWithChildren } from 'react'
import { useMoviesPrefetch } from '../lib/data/movies'

const UnauthenticatedLayout = ({ children }: PropsWithChildren<{}>) => {
  const prefetchMovies = useMoviesPrefetch()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 py-4 md:px-8">
        <nav className="flex items-center justify-between">
          <div>
            <Link href="/">
              <a onMouseEnter={prefetchMovies}>Home</a>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/signin">
              <a>Sign In</a>
            </Link>

            <Link href="/signup">
              <a>Sign Up</a>
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4">
        {children}
      </main>

      <footer className="flex h-12 w-full border-t px-4">
        <a
          className="flex items-center justify-center gap-2"
          href="https://supabase.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          &copy; Supabase QuickTix Example
        </a>
      </footer>
    </div>
  )
}

export default UnauthenticatedLayout
