import { Session } from '@supabase/supabase-js'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import supabase from './supabase'

export const AuthContext = createContext<Session | null>(null)

type AuthProviderProps = {}

export const AuthProvider = ({
  children,
}: PropsWithChildren<AuthProviderProps>) => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export const useUser = () => useAuth()?.user ?? null

export const useIsLoggedIn = () => {
  const user = useUser()

  return user !== null
}
