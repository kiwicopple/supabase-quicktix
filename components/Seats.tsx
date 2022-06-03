import { useCallback, useMemo, useState } from 'react'
import type { Seat as SeatType } from '../lib/data/movies'
import Seat from './Seat'

type SeatsProps = {
  seats: SeatType[]
  selectedSeatIds: Set<string>
  handleSeatClick: (seatId: string) => void
}

const Seats = ({ seats, selectedSeatIds, handleSeatClick }: SeatsProps) => {
  const seatsByRow = useMemo(() => {
    const groupedSeats = seats.reduce<{ [key: string]: SeatType[] }>(
      (acc, seat) => {
        const row = acc[seat.row] || []
        row.push(seat)
        acc[seat.row] = row
        return acc
      },
      {}
    )

    return Object.keys(groupedSeats)
      .sort()
      .map((row) => groupedSeats[row].sort((a, b) => a.number - b.number))
  }, [seats])

  return (
    <div className="flex flex-col gap-4">
      {seatsByRow.map((row, i) => (
        <div key={i} className="flex flex-row gap-4">
          {row.map((seat) => (
            <Seat
              key={seat.id}
              id={seat.id}
              row={seat.row}
              number={seat.number}
              state={
                seat.reserved_by_user_id !== null
                  ? 'reserved'
                  : selectedSeatIds.has(seat.id)
                  ? 'selected'
                  : 'empty'
              }
              onSeatClick={handleSeatClick}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Seats
