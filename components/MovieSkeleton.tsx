const ANIMATION_DELAY = 150

const MovieSkeleton = ({ index = 0 }) => {
  return (
    <div
      className="flex animate-pulse flex-col overflow-hidden rounded shadow"
      style={{
        animationFillMode: 'backwards',
        animationDelay: `${index * ANIMATION_DELAY}ms`,
      }}
    >
      <div className="h-[300px] w-[200px] bg-gray-200" />

      <div className="flex items-center justify-between rounded-b border-b border-l border-r border-gray-200 p-2">
        <div className="h-5 w-[90%] rounded bg-gray-200" />
      </div>
    </div>
  )
}

export default MovieSkeleton
