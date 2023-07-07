import { useContext } from 'react'
import { every, pick } from 'lodash'
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
        className="text-center text-lg text-black font-bold w-full h-full"
        type="button"
        onClick={() => onMark(x, y)}
      >
        {value}
      </button>
    </div>
  )
}

function checkBoard(
  board: (string | null)[][],
  i: number,
  j: number,
  token: string
) {
  // Full row
  if (every(board[i], (cell) => cell === token)) {
    return true
  }

  // Full column
  if (every([0, 1, 2], (x) => board[x][j] === token)) {
    return true
  }

  // Diagonal from left top to right bottom
  if (every([0, 1, 2], (x) => board[x][x] === token)) {
    return true
  }

  // Diagonal from right top to left bottom
  if (board[0][2] === token && board[1][1] === token && board[2][0] === token) {
    return true
  }

  return false
}

export function TicTacToeBoard() {
  const container = useContext(ContainerContext)
  const useMatchStore = container.resolve('useTicTacToeMatchStore')
  const { update, match, player } = useMatchStore((state) =>
    pick(state, 'update', 'match', 'player')
  )

  const onMark = async (x: number, y: number) => {
    const currPlayer = match.state.currentPlayer
    if (currPlayer === player.name && !match.state.winner) {
      const board = [...match.state.board]
      if (board[x][y] === null) {
        board[x][y] = player.state.token
        const winner = checkBoard(board, x, y, player.state.token)
          ? player.name
          : undefined
        const currentPlayer = Object.keys(match.players).find(
          (pname) => pname !== player.name
        )
        await update(
          match.status,
          { markedCells: [...player.state.markedCells, [x, y]] },
          { currentPlayer, board, winner }
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
