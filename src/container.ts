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
  MatchApiServiceFactory,
  createMatchApiServiceFactory,
  createMatchStore
} from './games'
import {
  TicTacToeMatchState,
  TicTacToePlayerState,
  createTicTacToeMatchVM
} from './games/tictactoe'
import { IMatchViewModel } from './games/match-view-model'
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
  useTicTacToeMatchStore: IMatchBoundedStore<
    TicTacToeMatchState,
    TicTacToePlayerState
  >
  createTicTacToeVM: IMatchViewModel<TicTacToeMatchState, TicTacToePlayerState>
}

export function configureContainer(): AwilixContainer<Dependencies> {
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
    useTicTacToeMatchStore: asFunction(
      createMatchStore<TicTacToeMatchState, TicTacToePlayerState>
    ).singleton(),
    createTicTacToeVM: asFunction(createTicTacToeMatchVM)
  })
}
