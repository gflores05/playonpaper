import { createBaseApiService } from './api-service'
import environment from '../environment'

export interface Game {
  id: number
  name: string
  code: string
  configuration: { [key: string]: unknown }
}

export interface CreateGameDto {
  name: string
  code: string
  configuration: { [key: string]: unknown }
}

export interface UpdateGameDto {
  name: string
  configuration: { [key: string]: unknown }
}

const gameService = createBaseApiService<Game, CreateGameDto, UpdateGameDto>({
  baseUrl: environment.apiUrl,
  resource: 'games'
})

export default gameService
