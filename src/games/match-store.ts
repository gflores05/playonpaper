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
import { MatchResponse, MatchSubscription } from './match-service'

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
  subscribe: (code: string) => Promise<MatchSubscription<MS, PS>>
  create: (gameId: number, state: MS) => Promise<Match<MS, PS>>
  update: (
    status: MatchStatus,
    playerState: Partial<PS>,
    newState: Partial<MS>
  ) => Promise<void>
  join: (code: string, player: MatchPlayer<PS>) => Promise<Match<MS, PS>>
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

      return match
    },
    async subscribe(code: string) {
      const fetched = await matchService.getAll({ code })

      const match = mapMatch(fetched[0])

      set({
        match
      })

      const subscriptions = matchService.connect(match.code, get().player.name)

      subscriptions.matchUpdates$.pipe(
        distinct(),
        tap((updates) => {
          console.log('updating state')
          const match = mapMatch(updates)
          set({ match })
        })
      )

      return subscriptions
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
