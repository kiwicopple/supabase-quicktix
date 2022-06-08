import clsx from 'clsx'
import { useCallback } from 'react'

type SeatProps = {
  id: string
  row: string
  number: number
  state?: 'empty' | 'reserved' | 'selected'
  onSeatClick?: (seatId: string) => void
}

const Seat = ({ id, row, number, state = 'empty', onSeatClick }: SeatProps) => {
  const handleClick = useCallback(() => {
    onSeatClick?.(id)
  }, [id, onSeatClick])

  return (
    <button
      onClick={handleClick}
      disabled={state === 'reserved'}
      className={clsx(
        'flex aspect-square w-10 flex-shrink-0 items-center justify-center rounded-b-md border p-1 font-semibold',
        state === 'empty' && 'border-blue-500 text-text',
        state === 'reserved' && 'border-gray-300 bg-gray-300 text-text',
        state === 'selected' && 'border-blue-700 bg-blue-700 text-white'
      )}
    >
      {row}
      {number}
    </button>
  )
}

export default Seat
