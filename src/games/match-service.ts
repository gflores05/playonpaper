import { Dependencies } from '@play/container'
import { GameDto } from '@play/services'
import axios from 'axios'
import { Subject } from 'rxjs'

interface MatchPlayer<PS> {
  state: PS
  name: string
}

export interface MatchResponse<MS, PS> {
  id: number
  start_date: string
  end_date: string
  state: MS
  status: string
  players: { [key: string]: MatchPlayer<PS> }
  code: string
  game: GameDto
}

interface MatchPlayer<PS> {
  state: PS
  name: string
  pmp?: string
}

interface CreateMatchRequest<MS, PS> {
  state: MS
  game_id: number
  challenger: MatchPlayer<PS>
}

interface CreateMatchResponse {
  code: string
  pmp: string
}

export enum MatchUpdateEvent {
  STATE_UPDATE = 1,
  PLAYER_LEFT = 2,
  PLAYER_JOIN = 3
}

interface UpdateMatchRequest<MS, PS> {
  event: MatchUpdateEvent
  player: MatchPlayer<PS>
  status?: string
  state: Partial<MS>
}

interface UpdateMatchResponse<MS> {
  code: string
  pmp: string
  state: MS
}

interface WebSocketMessage {
  event: MatchUpdateEvent
  content: unknown
}

export interface MatchSubscription<MS, PS> {
  matchUpdates$: Subject<MatchResponse<MS, PS>>
  playerJoin$: Subject<string>
  playerLeft$: Subject<string>
}

export interface IMatchService {
  get: <MS, PS>(code: string) => Promise<MatchResponse<MS, PS>>
  create: <MS, PS>(
    request: CreateMatchRequest<MS, PS>
  ) => Promise<CreateMatchResponse>
  update: <MS, PS>(
    code: string,
    request: UpdateMatchRequest<MS, PS>
  ) => Promise<UpdateMatchResponse<MS>>
  connect: <MS, PS>(code: string, player: string) => MatchSubscription<MS, PS>
}

export function createMatchService({
  apiUrl,
  wsUrl
}: Dependencies): IMatchService {
  const apiClient = axios.create({ baseURL: apiUrl })

  async function get<MS, PS>(code: string) {
    const response = await apiClient.get<MatchResponse<MS, PS>[]>(
      `matches/?code=${code}`
    )

    return response.data[0]
  }

  async function create<MS, PS>(request: CreateMatchRequest<MS, PS>) {
    const response = await apiClient.post<CreateMatchResponse>(
      'matches',
      request
    )

    return response.data
  }

  async function update<MS, PS>(
    code: string,
    request: UpdateMatchRequest<MS, PS>
  ) {
    const response = await apiClient.patch<UpdateMatchResponse<MS>>(
      `matches/${code}`,
      request
    )

    return response.data
  }

  function connect<MS, PS>(code: string, player: string) {
    const websocket = new WebSocket(`${wsUrl}/match/${code}/${player}`)

    const matchUpdates$ = new Subject<MatchResponse<MS, PS>>()
    const playerJoin$ = new Subject<string>()
    const playerLeft$ = new Subject<string>()

    websocket.onmessage = (evt) => {
      const message: WebSocketMessage = JSON.parse(evt.data)

      switch (message.event) {
        case MatchUpdateEvent.STATE_UPDATE:
          matchUpdates$.next(message.content as MatchResponse<MS, PS>)
          break
        case MatchUpdateEvent.PLAYER_JOIN:
          playerJoin$.next(message.content as string)
          break
        case MatchUpdateEvent.PLAYER_LEFT:
          playerLeft$.next(message.content as string)
          break
        default:
          break
      }
    }

    return { matchUpdates$, playerJoin$, playerLeft$ }
  }

  return {
    get,
    create,
    update,
    connect
  }
}
