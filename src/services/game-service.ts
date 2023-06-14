import { createBaseApiService } from '@play/services'
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

export const gameService = createBaseApiService<
  Game,
  CreateGameDto,
  UpdateGameDto
>({
  baseUrl: environment.apiUrl,
  resource: 'games'
})
