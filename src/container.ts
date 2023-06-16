import { createContainer, AwilixContainer, asValue, asFunction } from 'awilix'
import { IGameService, createGameService } from './services'
import {
  IChatBoundedStore,
  IGameStore,
  createChatStore,
  createGameStore
} from './stores'

export interface Dependencies {
  apiUrl: string
  wsUrl: string
  gameService: IGameService
  useGameStore: IGameStore
  useChatStore: IChatBoundedStore
}

export function configureContainer(): AwilixContainer<Dependencies> {
  return createContainer<
    Dependencies,
    AwilixContainer<Dependencies>
  >().register({
    apiUrl: asValue(process.env.REACT_APP_API_URL || ''),
    wsUrl: asValue(process.env.REACT_APP_WS_URL || ''),
    gameService: asFunction(createGameService),
    useGameStore: asFunction(createGameStore).singleton(),
    useChatStore: asFunction(createChatStore).singleton()
  })
}
