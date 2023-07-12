import { StoreApi, UseBoundStore, create } from 'zustand'
import { pick } from 'lodash'
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

function mapMatch<MS extends IMatchState, PS extends IPlayerState>(
  match: MatchResponse<MS, PS>
): Match<MS, PS> {
  return {
    ...pick(match, ['id', 'state', 'code', 'game']),
    status: MatchStatus[match.status as keyof typeof MatchStatus],
    start: new Date(match.start_date),
    end: new Date(match.end_date),
    players: match.players
  }
}

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
  subscribe: (code: string) => Promise<void>
  create: (gameId: number, state: MS) => Promise<Match<MS, PS>>
  update: (
    status: MatchStatus,
    playerState: Partial<PS>,
    newState: Partial<MS>
  ) => Promise<void>
  join: (
    code: string,
    player: MatchPlayer<PS>
  ) => Promise<[string, Match<MS, PS>]>
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
    async create(gameId: number, state: MS) {
      const matchCreated = await matchService.create({
        game_id: gameId,
        state
      })

      const match = mapMatch(matchCreated)

      set({
        match
      })

      return match
    },
    async join(code, player: MatchPlayer<PS>) {
      const joinResult = await matchService.join(code, {
        player
      })

      const result = await matchService.getAll({ code })

      const match = mapMatch(result[0])

      set({
        match: { ...get().match, ...match },
        player: { ...player, pmp: joinResult.pmp }
      })

      return [joinResult.pmp, match]
    },
    async subscribe(code: string) {
      const fetched = await matchService.getAll({ code })

      const match = mapMatch(fetched[0])

      const messages$ = matchService.connect(match.code, get().player.name)

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
