import { PlayStatus, GameStatus, PlayerStatus } from "./enum";

export interface Entity {
  id: number;
  created: Date;
  modified: Date;
}

export interface Game extends Entity {
  name: string;
  slug: string;
  status: GameStatus;
}

export interface User extends Entity {
  username: string;
  email: string;
}

export interface Player extends Entity {
  userId: number;
  name: string;
}

export interface Play extends Entity {
  gameId: number;
  status: PlayStatus;
  state: string;
  winner?: number;
};

export interface PlayerState extends Entity {
  playerId: number;
  playId: number;
  state?: string;
  status: PlayerStatus;
}
