import { createContainer, AwilixContainer, asValue, asFunction } from 'awilix'
import { IGameService, createGameService } from './services'
import {
  IChatBoundedStore,
  IGameStore,
  createChatStore,
  createGameStore
} from './stores'
import {
  IMatchBoundedStore,
  IMatchService,
  createMatchService,
  createMatchStore
} from './games'
import {
  TicTacToeMatchState,
  TicTacToePlayerState,
  createTicTacToeMatchVM
} from './games/tictactoe'
import { IMatchViewModel } from './games/match-view-model'

export interface Dependencies {
  apiUrl: string
  wsUrl: string
  gameService: IGameService
  matchService: IMatchService
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
    gameService: asFunction(createGameService),
    matchService: asFunction(createMatchService),
    useGameStore: asFunction(createGameStore).singleton(),
    useChatStore: asFunction(createChatStore).singleton(),
    useTicTacToeMatchStore: asFunction(
      createMatchStore<TicTacToeMatchState, TicTacToePlayerState>
    ).singleton(),
    createTicTacToeVM: asFunction(createTicTacToeMatchVM)
  })
}
