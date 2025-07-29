interface RoomCardProps {
  roomNumber: string
  building: string
  capacity: number
  occupied: number
  price: number
  onClick?: () => void
}

export default function RoomCard({ 
  roomNumber, 
  building, 
  capacity, 
  occupied, 
  price,
  onClick 
}: RoomCardProps) {
  const isFullyOccupied = occupied === capacity

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <h3 className="font-semibold text-gray-900 text-lg mb-3">{roomNumber}</h3>
      
      {/* Occupancy Indicators - Visual dots */}
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: capacity }).map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index < occupied ? 'bg-green-500' : 'bg-red-500'
            }`}
            title={index < occupied ? 'Occupied' : 'Available'}
          />
        ))}
      </div>
      
      {/* Occupancy Text */}
      {occupied > 0 && (
        <div className="text-sm text-gray-600">
          {isFullyOccupied ? (
            <span className="text-green-600 font-medium">Fully Occupied</span>
          ) : (
            <span>{occupied}/{capacity} Occupied</span>
          )}
        </div>
      )}
    </div>
  )
}