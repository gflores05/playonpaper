import { createCRUDStore } from '../util/crud-store'
import gameService from '../services/game-service'

export const useGameStore = createCRUDStore(gameService)
