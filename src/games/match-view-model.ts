import { IMatchBoundedStore } from './match-store'
import { IMatchState, IPlayerState, Match } from './types'

export interface IMatchViewModel<
  MS extends IMatchState = IMatchState,
  PS extends IPlayerState = IPlayerState
> {
  useMatchStore: IMatchBoundedStore<MS, PS>
  getInitialMatchState: () => MS
  getInitialPlayerState: () => PS
  getJoinInitialState: (player: string, current: Match<MS, PS>) => MS
  getJoinPlayerState: () => PS
}
