import { useState } from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { AuthProvider } from '../lib/auth'
import { NotFoundError, NotImplementedError } from '../lib/data/utils'
import { AppPropsWithLayout } from '../lib/types'
import '../styles/globals.css'

const CustomApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              // Don't retry on 404s or if we haven't finished writing the code
              if (
                error instanceof NotFoundError ||
                error instanceof NotImplementedError
              ) {
                return false
              }

              if (failureCount < 3) {
                return true
              }

              return false
            },
          },
        },
      })
  )

  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </Hydrate>
    </QueryClientProvider>
  )
}

export default CustomApp
