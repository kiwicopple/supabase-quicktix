import AuthenticatedLayout from '../components/AuthenticatedLayout'
import { NextPageWithLayout } from '../lib/types'

const BookingsPage: NextPageWithLayout = () => {
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">My Bookings</h2>
    </div>
  )
}

BookingsPage.getLayout = (page) => (
  <AuthenticatedLayout>{page}</AuthenticatedLayout>
)

export default BookingsPage
