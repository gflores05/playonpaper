import cx from 'classnames'
import { useBoard } from './board-hook'
import { memo } from 'react'

interface TicTacToeCellProps {
  value: string | null
  x: number
  y: number
  onMark: (x: number, y: number) => void
}

const TicTacToeCell = memo(function TicTacToeCell({
  value,
  x,
  y,
  onMark
}: TicTacToeCellProps) {
  return (
    <div
      className={cx(
        'flex justify-center items-center h-20',
        y === 1 && 'border-l-2 border-r-2',
        x === 1 && 'border-t-2 border-b-2'
      )}
    >
      <button
        className="text-center text-lg text-black font-bold w-full h-full"
        type="button"
        onClick={() => onMark(x, y)}
      >
        {value}
      </button>
    </div>
  )
})

export function TicTacToeBoard() {
  const { match, onMark } = useBoard()

  return (
    <div className="grid grid-cols-3">
      {match.state.board.map((row, x) => {
        return row.map((value, y) => (
          <TicTacToeCell
            key={`${match.code}-${x}-${y}`}
            value={value}
            x={x}
            y={y}
            onMark={onMark}
          />
        ))
      })}
    </div>
  )
}
