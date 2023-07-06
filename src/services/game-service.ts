import { Dependencies } from '@play/container'
import { IApiService } from '@play/services'

export interface GameDto {
  id: number
  name: string
  slug: string
  configuration: { [key: string]: unknown }
}

export interface CreateGameRequest {
  name: string
  code: string
  configuration: { [key: string]: unknown }
}

export interface UpdateGameRequest {
  name: string
  configuration: { [key: string]: unknown }
}

export interface IGameService
  extends IApiService<GameDto, CreateGameRequest, UpdateGameRequest> {}

export const createGameService = ({
  apiServiceFactory
}: Dependencies): IGameService =>
  apiServiceFactory<GameDto, CreateGameRequest, UpdateGameRequest>('games')
