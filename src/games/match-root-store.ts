import { StoreApi, UseBoundStore, create } from 'zustand'

interface IMatchRootStore {
  slug: string
  pmp?: string
  setSlug: (slug: string) => void
  setPmp: (pmp: string) => void
}

export interface IMatchRootBoundedStore
  extends UseBoundStore<StoreApi<IMatchRootStore>> {}

export function createMatchRootStore() {
  return create<IMatchRootStore>()((set) => ({
    slug: '',
    setSlug(slug) {
      set({ slug })
    },
    setPmp(pmp) {
      set({ pmp })
    }
  }))
}
