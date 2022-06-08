import { PostgrestError, Session, User } from '@supabase/supabase-js'
import gravatarUrl from 'gravatar-url'
import { useMutation, useQueryClient } from 'react-query'
import supabase from '../supabase'
import { NotImplementedError } from './utils'

/* Sign In */

type SignInData = { session: Session | null; user: User | null }
type SignInVariables = { email: string; password: string }
type SignInError = PostgrestError | NotImplementedError

export async function signIn({ email, password }: SignInVariables): Promise<{
  session: Session | null
  user: User | null
}> {
  const { error, session, user } = await supabase.auth.signIn({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return { session, user }
}

export const useSignInMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<SignInData, SignInError, SignInVariables>(
    ({ email, password }) => signIn({ email, password }),
    {
      async onSuccess() {
        await queryClient.resetQueries()
      },
    }
  )
}

/* Sign Up */

type SignUpData = { session: Session | null; user: User | null }
type SignUpVariables = { name: string; email: string; password: string }
type SignUpError = PostgrestError | NotImplementedError

export async function signUp({ name, email, password }: SignUpVariables) {
  const { error, session, user } = await supabase.auth.signUp(
    {
      email,
      password,
    },
    {
      data: {
        full_name: name,
        avatar_url: gravatarUrl(email, {
          size: 512,
          rating: 'pg',
          default: 'mm',
        }),
      },
    }
  )

  if (error) {
    throw error
  }

  return { session, user }
}

export const useSignUpMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<SignUpData, SignUpError, SignUpVariables>(
    ({ name, email, password }) => signUp({ name, email, password }),
    {
      async onSuccess() {
        await queryClient.resetQueries()
      },
    }
  )
}

/* Forgot Password */

type ForgotPasswordData = { success: boolean }
type ForgotPasswordVariables = { email: string }

export async function forgotPassword({ email }: ForgotPasswordVariables) {
  const { success } = await fetch(`/api/auth/forgot-password`, {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json())

  return { success }
}

export const useForgotPasswordMutation = () => {
  return useMutation<ForgotPasswordData, unknown, ForgotPasswordVariables>(
    ({ email }) => forgotPassword({ email })
  )
}

/* Sign Out */

type SignOutData = void
type SignOutVariables = void
type SignOutError = PostgrestError | NotImplementedError

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export const useSignOutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<SignOutData, SignOutError, SignOutVariables>(
    () => signOut(),
    {
      async onSuccess() {
        await queryClient.resetQueries()
      },
    }
  )
}
