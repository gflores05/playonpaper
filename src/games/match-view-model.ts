import { IMatchBoundedStore } from './match-store'
import { IMatchState, IPlayerState } from './types'

export interface IMatchViewModel<
  MS extends IMatchState = IMatchState,
  PS extends IPlayerState = IPlayerState
> {
  useMatchStore: IMatchBoundedStore<MS, PS>
  getInitialMatchState: () => MS
  getInitialPlayerState: () => PS
  getJoinState: (player: string) => Partial<MS>
  getJoinPlayerState: (player: string) => PS
}
