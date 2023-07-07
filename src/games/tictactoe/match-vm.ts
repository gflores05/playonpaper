import { IMatchViewModel } from '../match-view-model'
import { Match } from '../types'
import { TicTacToeMatchState, TicTacToePlayerState } from './types'
import { Dependencies } from '@play/container'

export function createTicTacToeMatchVM({
  useTicTacToeMatchStore
}: Dependencies): IMatchViewModel<TicTacToeMatchState, TicTacToePlayerState> {
  return {
    useMatchStore: useTicTacToeMatchStore,
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
