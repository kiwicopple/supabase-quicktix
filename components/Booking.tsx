import { ArrowRightIcon } from '@heroicons/react/solid'
import Image from 'next/image'
import Link from 'next/link'
import { MovieWithSeats } from '../lib/data/movies'
import Seat from './Seat'

export type BookingProps = {
  booking: MovieWithSeats
}

const Booking = ({ booking }: BookingProps) => {
  return (
    <div className="flex gap-4 overflow-hidden rounded border border-gray-200 shadow">
      <div className="flex items-center">
        {booking.thumbnail_url ? (
          <Image
            width={100}
            height={150}
            className="bg-gray-300"
            src={booking.thumbnail_url}
            alt={booking.title}
          />
        ) : (
          <div className="aspect-[2/3] h-[300px] bg-gray-300" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 rounded-r pr-4 pb-4 pt-2">
        <h3 className="font-medium text-lg">{booking.title}</h3>

        <div className="flex flex-wrap gap-2">
          {booking.seats.map((seat) => (
            <Seat
              key={seat.id}
              id={seat.id}
              row={seat.row}
              number={seat.number}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Link href={`/${booking.id}`}>
            <a className="flex items-center gap-1 text-gray-700 transition-colors duration-200 text-sm hover:text-blue-600">
              Book more seats <ArrowRightIcon className="h-3 w-3" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Booking
