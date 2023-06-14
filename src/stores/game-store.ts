import { createCRUDStore } from '@play/util'
import { gameService } from '@play/services'

export const useGameStore = createCRUDStore(gameService)
