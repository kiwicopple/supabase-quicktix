import Head from 'next/head'
import AuthenticatedLayout from '../components/AuthenticatedLayout'
import { NextPageWithLayout } from '../lib/types'

const BookingsPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>My Bookings | QuickTix</title>
      </Head>

      <div className="mb-12 space-y-8">
        <h2 className="font-bold text-lg">My Bookings</h2>
      </div>
    </>
  )
}

BookingsPage.getLayout = (page) => (
  <AuthenticatedLayout>{page}</AuthenticatedLayout>
)

export default BookingsPage
