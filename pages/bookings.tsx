import Head from 'next/head'
import AuthenticatedLayout from '../components/AuthenticatedLayout'
import Booking from '../components/Booking'
import ErrorDisplay from '../components/ErrorDisplay'
import { useMyBookingsQuery } from '../lib/data/bookings'
import { NextPageWithLayout } from '../lib/types'

const BookingsPage: NextPageWithLayout = () => {
  const { data, isLoading, isSuccess, isError, error } = useMyBookingsQuery()

  return (
    <>
      <Head>
        <title>My Bookings | QuickTix</title>
      </Head>

      <div className="mb-12 space-y-8">
        <h2 className="font-bold text-lg">My Bookings</h2>

        <div>
          {isError && <ErrorDisplay error={error} />}

          {isSuccess && (
            <div>
              {data.bookings.map((booking) => (
                <Booking key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

BookingsPage.getLayout = (page) => (
  <AuthenticatedLayout>{page}</AuthenticatedLayout>
)

export default BookingsPage
