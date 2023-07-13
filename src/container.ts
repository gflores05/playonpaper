import { createContainer, AwilixContainer, asValue, asFunction } from 'awilix'
import { AxiosInstance } from 'axios'
import {
  IChatBoundedStore,
  IGameStore,
  createChatStore,
  createGameStore
} from './stores'
import {
  IMatchBoundedStore,
  IMatchRootBoundedStore,
  MatchApiServiceFactory,
  createMatchApiServiceFactory,
  createMatchStore
} from './games'
import { createMatchRootStore } from './games/match-root-store'
import {
  TicTacToeMatchState,
  TicTacToePlayerState,
  createTicTacToeMatchFactory
} from './games/tictactoe'
import { IMatchFactory } from './games/match-factory'
import { createApiClient } from './services/api-client'
import {
  ApiServiceFactory,
  IGameService,
  createApiServiceFactory,
  createGameService
} from './services'

export interface Dependencies {
  apiUrl: string
  wsUrl: string
  apiClient: AxiosInstance
  apiServiceFactory: ApiServiceFactory
  matchApiServiceFactory: MatchApiServiceFactory
  gameService: IGameService
  useGameStore: IGameStore
  useChatStore: IChatBoundedStore
  useMatchRootStore: IMatchRootBoundedStore
  useTicTacToeMatchStore: IMatchBoundedStore<
    TicTacToeMatchState,
    TicTacToePlayerState
  >
  factoryTicTacToe: IMatchFactory<TicTacToeMatchState, TicTacToePlayerState>
}

export function configureContainer(): AwilixContainer<Dependencies> {
  try {
    return createContainer<
      Dependencies,
      AwilixContainer<Dependencies>
    >().register({
      apiUrl: asValue(process.env.REACT_APP_API_URL || ''),
      wsUrl: asValue(process.env.REACT_APP_WS_URL || ''),
      apiClient: asFunction(createApiClient),
      apiServiceFactory: asFunction(createApiServiceFactory),
      matchApiServiceFactory: asFunction(createMatchApiServiceFactory),
      gameService: asFunction(createGameService),
      useGameStore: asFunction(createGameStore).singleton(),
      useChatStore: asFunction(createChatStore).singleton(),
      useMatchRootStore: asFunction(createMatchRootStore).singleton(),
      useTicTacToeMatchStore: asFunction(
        createMatchStore<TicTacToeMatchState, TicTacToePlayerState>
      ).singleton(),
      factoryTicTacToe: asFunction(createTicTacToeMatchFactory)
    })
  } catch (error) {
    console.error(error)
  }
  return createContainer()
}
