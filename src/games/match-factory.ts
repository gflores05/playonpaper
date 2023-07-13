import { IMatchState, IPlayerState, Match } from './types'

export interface IMatchFactory<
  MS extends IMatchState = IMatchState,
  PS extends IPlayerState = IPlayerState
> {
  getInitialMatchState: () => MS
  getInitialPlayerState: () => PS
  getJoinInitialState: (player: string, current: Match<MS, PS>) => MS
  getJoinPlayerState: () => PS
}
