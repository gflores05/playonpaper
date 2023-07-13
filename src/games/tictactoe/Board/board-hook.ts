import { every, pick } from 'lodash'
import { useCallback, useContext } from 'react'
import { ContainerContext } from '@play/context'

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

export function useBoard() {
  const container = useContext(ContainerContext)
  const useMatchStore = container.resolve('useTicTacToeMatchStore')
  const { update, match, player } = useMatchStore((state) =>
    pick(state, 'update', 'match', 'player')
  )

  const onMark = useCallback(
    async (x: number, y: number) => {
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
    },
    [match, player, update]
  )

  return { match, onMark }
}
