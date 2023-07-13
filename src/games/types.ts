/* eslint-disable @typescript-eslint/no-redeclare */
export interface Game {
  id: number
  name: string
  slug: string
  configuration: { [key: string]: unknown }
}

export const Game = {
  none() {
    return {
      id: 0,
      name: '',
      slug: '',
      configuration: {}
    } as Game
  }
}

export enum MatchStatus {
  IDLE = 'IDLE',
  WAITING = 'WAITING',
  PLAYING = 'PLAYING',
  ENDED = 'ENDED'
}
export interface IMatchState {
  winner?: string
}

export interface IPlayerState {}

export interface Match<
  MS extends IMatchState = IMatchState,
  PS extends IPlayerState = IPlayerState
> {
  id: number
  start: Date
  end: Date
  code: string
  state: MS
  game: Game
  players: { [key: string]: MatchPlayer<PS> }
  status: MatchStatus
}

export const Match = {
  none<MS extends IMatchState, PS extends IPlayerState>() {
    return {
      id: 0,
      start: new Date(),
      end: new Date(),
      code: '',
      state: {},
      game: {},
      players: {}
    } as Match<MS, PS>
  }
}

export interface MatchPlayer<PS extends IPlayerState = IPlayerState> {
  name: string
  pmp?: string
  state: PS
}

export const MatchPlayer = {
  none<PS extends IPlayerState>() {
    return { name: '', pmp: '', state: {} } as MatchPlayer<PS>
  }
}
