import { StoreApi, UseBoundStore, create } from 'zustand'
import { pick } from 'lodash'
import { distinct, tap } from 'rxjs'
import {
  MatchPlayer,
  Match,
  MatchStatus,
  IMatchState,
  IPlayerState
} from './types'
import { Dependencies } from '@play/container'
import {
  MatchResponse,
  MatchSubscription,
  MatchUpdateEvent
} from './match-service'

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

export interface MatchStore<MS extends IMatchState, PS extends IPlayerState> {
  match: Match<MS, PS>
  player: MatchPlayer<PS>
  websocket?: WebSocket
  subscribe: (code: string) => Promise<MatchSubscription<MS, PS>>
  create: (
    gameId: number,
    state: MS,
    challenger: MatchPlayer<PS>
  ) => Promise<Match<MS, PS>>
  update: (playerState: Partial<PS>, newState: Partial<MS>) => Promise<void>
  join: (code: string, player: MatchPlayer<PS>) => Promise<Match<MS, PS>>
}

export const createMatchStore = <
  MS extends IMatchState,
  PS extends IPlayerState
>({
  matchService
}: Dependencies) =>
  create<MatchStore<MS, PS>>()((set, get) => ({
    match: Match.none<MS, PS>(),
    player: MatchPlayer.none<PS>(),
    async create(gameId: number, state: MS, challenger: MatchPlayer<PS>) {
      const matchCreated = await matchService.create({
        game_id: gameId,
        challenger,
        state
      })

      const match = await matchService.get<MS, PS>(matchCreated.code)

      const result = mapMatch(match)

      set({
        player: { ...challenger, pmp: matchCreated.pmp },
        match: result
      })

      return result
    },
    async subscribe(code: string) {
      let match: Match<MS, PS>

      if (get().match.id === 0) {
        const fetched = await matchService.get<MS, PS>(code)

        match = mapMatch(fetched)

        set({
          match
        })
      } else {
        match = get().match
      }

      const subscriptions = matchService.connect<MS, PS>(
        match.code,
        get().player.name
      )

      subscriptions.matchUpdates$.pipe(
        distinct(),
        tap((match) => set({ match: mapMatch(match) }))
      )

      return subscriptions
    },
    async update(playerState: Partial<PS>, newState: Partial<MS>) {
      const player = {
        ...get().player,
        state: { ...get().player.state, ...playerState }
      }
      const match = get().match
      const matchState = { ...match.state, ...newState }

      const updated = await matchService.update<MS, PS>(match.code, {
        player,
        state: matchState,
        event: MatchUpdateEvent.STATE_UPDATE
      })

      set({ match: { ...match, state: updated.state } })
    },
    async join(code, player: MatchPlayer<PS>) {
      const updated = await matchService.update<MS, PS>(code, {
        player,
        state: {},
        event: MatchUpdateEvent.PLAYER_JOIN
      })

      const result = await matchService.get<MS, PS>(code)

      const match = mapMatch(result)

      set({
        match: { ...get().match, ...match },
        player: { ...player, pmp: updated.pmp }
      })

      return match
    }
  }))
