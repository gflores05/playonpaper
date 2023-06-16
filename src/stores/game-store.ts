import { StoreApi, UseBoundStore } from 'zustand'
import { Dependencies } from '@play/container'
import { CreateGameDto, Game, UpdateGameDto } from '@play/services'
import { CRUDStore, createCRUDStore } from '@play/util'

export interface IGameStore
  extends UseBoundStore<
    StoreApi<CRUDStore<Game, CreateGameDto, UpdateGameDto>>
  > {}

export const createGameStore = ({ gameService }: Dependencies) =>
  createCRUDStore(gameService)
