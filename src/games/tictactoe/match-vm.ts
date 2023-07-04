import { IMatchViewModel } from '../match-view-model'
import { TicTacToeMatchState, TicTacToePlayerState } from './types'
import { Dependencies } from '@play/container'

export function createTicTacToeMatchVM({
  useTicTacToeMatchStore
}: Dependencies): IMatchViewModel<TicTacToeMatchState, TicTacToePlayerState> {
  return {
    useMatchStore: useTicTacToeMatchStore,
    getInitialMatchState: () => TicTacToeMatchState.none(),
    getInitialPlayerState: () => TicTacToePlayerState.none(),
    getJoinState: (player: string) => ({ currentPlayer: player }),
    getJoinPlayerState: (player: string) => ({
      ...TicTacToePlayerState.none(),
      token: '0'
    })
  }
}
