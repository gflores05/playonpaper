import { useContext } from 'react'
import { pick } from 'lodash'
import cx from 'classnames'
import { ContainerContext } from '@play/context'

interface TicTacToeCellProps {
  value: string | null
  x: number
  y: number
  onMark: (x: number, y: number) => void
}

function TicTacToeCell({ value, x, y, onMark }: TicTacToeCellProps) {
  return (
    <div
      className={cx(
        'flex justify-center items-center h-20',
        y === 1 && 'border-l-2 border-r-2',
        x === 1 && 'border-t-2 border-b-2'
      )}
    >
      <button
        className="text-center text-lg text-black font-bold"
        type="button"
        onClick={() => onMark(x, y)}
      >
        {value}
      </button>
    </div>
  )
}

export function TicTacToeBoard() {
  const container = useContext(ContainerContext)
  const useMatchStore = container.resolve('useTicTacToeMatchStore')
  const { update, match, player } = useMatchStore((state) =>
    pick(state, 'update', 'match', 'player')
  )
  const onMark = (x: number, y: number) => {
    if (match.state.currentPlayer === player.name) {
      const board = [...match.state.board]
      if (board[x][y] === null) {
        board[x][y] = player.state.token
        const currentPlayer = Object.keys(match.players).find(
          (pname) => pname !== player.name
        )
        update(
          { markedCells: [...player.state.markedCells, [x, y]] },
          { currentPlayer, board }
        )
      }
    }
  }

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
