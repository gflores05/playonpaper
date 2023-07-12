import { Dependencies } from '@play/container'
import { StoreApi, UseBoundStore, create } from 'zustand'

interface IMatchRootStore {
  slug: string
  pmp?: string
  gameId: number
  fetchByCode: (code: string) => Promise<void>
  setSlug: (slug: string) => void
  setPmp: (pmp: string) => void
  setGameId: (gameId: number) => void
}

export interface IMatchRootBoundedStore
  extends UseBoundStore<StoreApi<IMatchRootStore>> {}

export function createMatchRootStore({ matchApiServiceFactory }: Dependencies) {
  const matchService = matchApiServiceFactory()

  return create<IMatchRootStore>()((set) => ({
    slug: '',
    gameId: 0,
    setSlug(slug) {
      set({ slug })
    },
    setPmp(pmp) {
      set({ pmp })
    },
    setGameId(gameId: number) {
      set({ gameId })
    },
    async fetchByCode(code: string) {
      const result = await matchService.getAll({ code })

      if (!result.length) {
        throw Error('No match with this code found')
      }

      set({ slug: result[0].game.slug })
    }
  }))
}
