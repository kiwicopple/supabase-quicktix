import { SeatSkeleton } from './SeatsSkeleton'
import SkeletonList from './SkeletonList'

const BookingSkeleton = () => {
  return (
    <div className="flex gap-4 overflow-hidden rounded border border-gray-200 shadow">
      <div className="h-[150px] w-[100px] animate-pulse bg-gray-200" />

      <div className="flex flex-1 flex-col justify-between gap-4 rounded-r pr-4 pb-4 pt-2">
        <div>
          <div className="h-1" />
          <div className="h-5 w-[40%] animate-pulse rounded bg-gray-200" />
          <div className="h-1" />
        </div>

        <div className="flex flex-wrap gap-2">
          <SkeletonList skeleton={SeatSkeleton} count={4} />
        </div>

        <div className="flex justify-end">
          <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

export default BookingSkeleton
