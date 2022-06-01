import type { Seat } from '../lib/data/movies'
import SeatIcon from './SeatIcon'

type SeatsProps = {
  seats: Seat[]
}

const Seats = ({ seats }: SeatsProps) => {
  // group by seat.row
  const groupedSeats = seats.reduce((acc, seat) => {
    const row = acc[seat.row] || []
    row.push(seat)
    acc[seat.row] = row
    return acc
  }, {})
  console.log('groupedSeats:', groupedSeats)

  return (
    <div>
      {seats.map((seat) => (
        <SeatIcon key={seat.id} row={seat.row} number={seat.number} />
      ))}
    </div>
  )
}

export default Seats
