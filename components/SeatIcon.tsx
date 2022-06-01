type SeatIconProps = {
  row: string
  number: number
}

const SeatIcon = ({ row, number }: SeatIconProps) => {
  return (
    <div className="rounded-b-sm border border-blue-500 p-1">
      {row}
      {number}
    </div>
  )
}

export default SeatIcon
