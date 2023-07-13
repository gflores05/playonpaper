import { StoreApi, UseBoundStore, create } from 'zustand'
import { Observable, map, tap, filter } from 'rxjs'
import {
  MatchPlayer,
  Match,
  MatchStatus,
  IMatchState,
  IPlayerState
} from './types'
import { Dependencies } from '@play/container'
import { MatchResponse, MatchUpdateEvent } from './match-service'
import { mapMatch } from './mappers'

export interface IMatchBoundedStore<
  MS extends IMatchState,
  PS extends IPlayerState
> extends UseBoundStore<StoreApi<MatchStore<MS, PS>>> {}

export interface MatchStore<
  MS extends IMatchState = IMatchState,
  PS extends IPlayerState = IPlayerState
> {
  match: Match<MS, PS>
  player: MatchPlayer<PS>
  matchUpdates$?: Observable<MatchResponse<MS, PS>>
  playerJoin$?: Observable<string>
  playerLeft$?: Observable<string>
  update: (
    status: MatchStatus,
    playerState: Partial<PS>,
    newState: Partial<MS>
  ) => Promise<void>
  subscribe: (code: string, player: string, pmp: string) => Promise<void>
}

export const createMatchStore = <
  MS extends IMatchState = IMatchState,
  PS extends IPlayerState = IPlayerState
>({
  matchApiServiceFactory
}: Dependencies) => {
  const matchService = matchApiServiceFactory<MS, PS>()

  return create<MatchStore<MS, PS>>()((set, get) => ({
    match: Match.none<MS, PS>(),
    player: MatchPlayer.none<PS>(),
    async subscribe(code: string, player: string, pmp: string) {
      const fetched = await matchService.getAll({ code })

      const match = mapMatch(fetched[0])

      const messages$ = matchService.connect(match.code, player)

      const matchUpdates$ = messages$.pipe(
        filter(
          (message) => message.content.event === MatchUpdateEvent.STATE_UPDATE
        ),
        map((message) => message.content.data as MatchResponse<MS, PS>),
        tap((response) => set({ match: mapMatch(response) }))
      )
      const playerJoin$ = messages$.pipe(
        filter(
          (message) => message.content.event === MatchUpdateEvent.PLAYER_JOIN
        ),
        map((message) => message.content.data as string)
      )
      const playerLeft$ = messages$.pipe(
        filter(
          (message) => message.content.event === MatchUpdateEvent.PLAYER_LEFT
        ),
        map((message) => message.content.data as string)
      )

      set({
        match,
        player: { ...match.players[player], pmp },
        matchUpdates$,
        playerJoin$,
        playerLeft$
      })
    },
    async update(
      status: MatchStatus,
      playerState: Partial<PS>,
      newState: Partial<MS>
    ) {
      const player = {
        ...get().player,
        state: { ...get().player.state, ...playerState }
      }

      const match = get().match

      const updated = await matchService.update(get().match.id, {
        status,
        player,
        state: newState
      })

      set({ match: { ...match, ...updated } })
    }
  }))
}
