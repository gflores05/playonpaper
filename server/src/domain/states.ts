import { PlayStatus } from "./enum";

export interface IPlayerState {
  id: string;
  name: string;
}

export interface IGameState {}

export type Game<G extends IGameState, P extends IPlayerState> = {
  id?: string;
  game: string;
  maxPlayers: number;
  status: PlayStatus;
  players: {
    [key: string]: P;
  };
  state: G;
  winner?: string;
};
