import { IPlayerState } from "./states";

export interface IGameWorker {
  join(gameId: string);
  move(gameId: string, playerState: IPlayerState);
  leave(gameId: string);
}
