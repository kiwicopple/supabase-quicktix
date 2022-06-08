import { useMemo } from 'react'
import SkeletonList from './SkeletonList'

const ANIMATION_DELAY = 150

export const SeatSkeleton = ({ index = 0 }) => {
  return (
    <div
      className="flex aspect-square w-10 animate-pulse rounded-b-md border bg-gray-200 p-1"
      style={{
        animationFillMode: 'backwards',
        animationDelay: `${index * ANIMATION_DELAY}ms`,
      }}
    />
  )
}

const SeatsSkeleton = ({ rowsCount = 5 }) => {
  const rows = useMemo(() => Array.from({ length: rowsCount }), [rowsCount])

  return (
    <div className="flex flex-col gap-4">
      {rows.map((_, i) => (
        <div key={i} className="flex flex-row gap-4">
          <SkeletonList skeleton={SeatSkeleton} count={8} />
        </div>
      ))}
    </div>
  )
}

export default SeatsSkeleton
