import { IMatchState, IPlayerState } from '../types'

/* eslint-disable @typescript-eslint/no-redeclare */
export interface TicTacToeMatchState extends IMatchState {
  board: (string | null)[][]
  currentPlayer?: string
}

export const TicTacToeMatchState = {
  none: () => {
    return {
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ]
    } as TicTacToeMatchState
  }
}

export interface TicTacToePlayerState extends IPlayerState {
  markedCells: number[][]
  token: string
}

export const TicTacToePlayerState = {
  none: () => {
    return {
      markedCells: [],
      token: '0'
    }
  }
}
