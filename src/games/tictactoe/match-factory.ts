import { IMatchFactory } from '../match-factory'
import { Match } from '../types'
import { TicTacToeMatchState, TicTacToePlayerState } from './types'

export function createTicTacToeMatchFactory(): IMatchFactory<
  TicTacToeMatchState,
  TicTacToePlayerState
> {
  return {
    getInitialMatchState: () => TicTacToeMatchState.none(),
    getInitialPlayerState: () => TicTacToePlayerState.none(),
    getJoinInitialState: (
      player: string,
      match: Match<TicTacToeMatchState, TicTacToePlayerState>
    ) => {
      if (!match.state.currentPlayer) {
        return { ...match.state, currentPlayer: player }
      }
      return match.state
    },
    getJoinPlayerState: () => ({
      ...TicTacToePlayerState.none(),
      token: 'X'
    })
  }
}
