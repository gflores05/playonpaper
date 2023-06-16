import { Dependencies } from '@play/container'
import { IApiService, createBaseApiService } from '@play/services'

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

export interface IGameService
  extends IApiService<Game, CreateGameDto, UpdateGameDto> {}

export const createGameService = ({ apiUrl }: Dependencies): IGameService =>
  createBaseApiService<Game, CreateGameDto, UpdateGameDto>({
    baseUrl: apiUrl,
    resource: 'games'
  })
