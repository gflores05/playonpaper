import { StoreApi, UseBoundStore } from 'zustand'
import { Dependencies } from '@play/container'
import { CreateGameRequest, UpdateGameRequest } from '@play/services'
import { CRUDStore, createCRUDStore } from '@play/util'
import { Game } from '@play/games'

export interface IGameStore
  extends UseBoundStore<
    StoreApi<CRUDStore<Game, CreateGameRequest, UpdateGameRequest>>
  > {}

export const createGameStore = ({ gameService }: Dependencies) =>
  createCRUDStore(gameService, (dto) => ({ ...dto }))
