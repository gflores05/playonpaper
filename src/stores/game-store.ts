import { create } from 'zustand'
import axios from 'axios'

interface Game {
  id: number
  name: string
  code: string
  configuration: { [key: string]: unknown }
}

interface GameStore {
  current?: Game
  games: Game[]
  fetch: () => Promise<void>
  select: (game: Game) => void
}

export const useGameStore = create<GameStore>()((set) => ({
  games: [],
  fetch: async () => {
    const response = await axios.get<Game[]>('http://localhost:8000/games')

    if (response.status === 200) {
      set({ games: response.data })
    }
  },
  select: (current: Game) => set({ current })
}))
