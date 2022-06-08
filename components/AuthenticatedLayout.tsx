import Link from 'next/link'
import { useRouter } from 'next/router'
import { PropsWithChildren, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useUser } from '../lib/auth'
import { useSignOutMutation } from '../lib/data/auth'
import { useBookingsPrefetch } from '../lib/data/bookings'
import supabase from '../lib/supabase'
import Avatar from './Avatar'

const AuthenticatedLayout = ({ children }: PropsWithChildren<{}>) => {
  const router = useRouter()
  const user = useUser()

  useEffect(() => {
    // Checking the user from supabase js as user is always null on the first
    // render to support SSR
    if (supabase.auth.user() === null) {
      router.push('/signin')
    }
  }, [user])

  const { mutate: signOut } = useSignOutMutation()
  const onSignOut = useCallback(() => {
    signOut(undefined, {
      onSuccess() {
        toast.success('You have signed out successfully!')
        router.replace('/')
      },
      onError(error) {
        toast.error(error.message)
      },
    })
  }, [])

  const prefetchBookings = useBookingsPrefetch()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 py-4 md:px-8">
        <nav className="flex items-center justify-between">
          <div>
            <Link href="/">
              <a>Home</a>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/bookings">
              <a
                className="inline-flex items-center"
                onMouseEnter={prefetchBookings}
              >
                <Avatar
                  name={user?.user_metadata.full_name}
                  avatarUrl={user?.user_metadata.avatar_url}
                />
                <span className="ml-2">
                  {user?.user_metadata.full_name ?? user?.email ?? 'Account'}
                </span>
              </a>
            </Link>

            <button onClick={onSignOut}>Sign Out</button>
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

export default AuthenticatedLayout
