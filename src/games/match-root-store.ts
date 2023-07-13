import { Dependencies } from '@play/container'
import { StoreApi, UseBoundStore, create } from 'zustand'
import { Game, IMatchState, Match, MatchPlayer, MatchStatus } from './types'
import { mapMatch } from './mappers'

interface IMatchRootStore {
  pmp?: string
  name: string
  game: Game
  fetchByCode: (code: string) => Promise<void>
  setGame: (game: Game) => void
  create: (state: IMatchState) => Promise<Match>
  update: (
    matchId: number,
    status: MatchStatus,
    newState: Partial<IMatchState>
  ) => Promise<void>
  join: (code: string, player: MatchPlayer) => Promise<Match>
}

export interface IMatchRootBoundedStore
  extends UseBoundStore<StoreApi<IMatchRootStore>> {}

export function createMatchRootStore({ matchApiServiceFactory }: Dependencies) {
  const matchService = matchApiServiceFactory()

  return create<IMatchRootStore>()((set, get) => ({
    game: Game.none(),
    name: '',
    setGame(game: Game) {
      set({ game })
    },
    async fetchByCode(code: string) {
      const result = await matchService.getAll({ code })

      if (!result.length) {
        throw Error('No match with this code found')
      }

      set({ game: result[0].game })
    },
    async create(state: IMatchState) {
      const matchCreated = await matchService.create({
        game_id: get().game.id,
        state
      })

      const match = mapMatch(matchCreated)

      set({
        game: match.game
      })

      return match
    },
    async join(code, player: MatchPlayer) {
      const joinResult = await matchService.join(code, {
        player
      })

      const result = await matchService.getAll({ code })

      const match = mapMatch(result[0])

      set({
        game: match.game,
        pmp: joinResult.pmp,
        name: player.name
      })

      return match
    },
    async update(
      matchId: number,
      status: MatchStatus,
      state: Partial<IMatchState>
    ) {
      await matchService.update(matchId, {
        status,
        player: { name: get().name, pmp: get().pmp, state: {} },
        state
      })
    }
  }))
}
