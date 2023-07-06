import { Dependencies } from '@play/container'
import { GameDto, IApiService } from '@play/services'
import { Subject } from 'rxjs'
import { IMatchState, IPlayerState, MatchStatus } from './types'

interface MatchPlayer<PS> {
  state: PS
  name: string
  pmp?: string
}

export interface MatchResponse<MS, PS> {
  id: number
  start_date: string
  end_date: string
  state: MS
  status: MatchStatus
  players: { [key: string]: MatchPlayer<PS> }
  code: string
  game: GameDto
}

export interface CreateMatchRequest<MS> {
  state: MS
  game_id: number
}

export enum MatchUpdateEvent {
  STATE_UPDATE = 1,
  PLAYER_LEFT = 2,
  PLAYER_JOIN = 3
}

export interface UpdateMatchRequest<MS, PS> {
  player: MatchPlayer<PS>
  status?: MatchStatus
  state: Partial<MS>
}

interface JoinMatchRequest<PS> {
  player: MatchPlayer<PS>
}

interface JoinMatchResponse {
  pmp: string
}

interface WebSocketMessageContent {
  event: MatchUpdateEvent
  data: unknown
}

interface WebSocketMessage {
  sender: string
  content: WebSocketMessageContent
}

export interface MatchSubscription<MS, PS> {
  matchUpdates$: Subject<MatchResponse<MS, PS>>
  playerJoin$: Subject<string>
  playerLeft$: Subject<string>
}

export interface IMatchService<
  MS extends IMatchState = IMatchState,
  PS extends IPlayerState = IPlayerState
> extends IApiService<
    MatchResponse<MS, PS>,
    CreateMatchRequest<MS>,
    UpdateMatchRequest<MS, PS>
  > {
  connect: (code: string, player: string) => MatchSubscription<MS, PS>
  join: (
    code: string,
    payload: JoinMatchRequest<PS>
  ) => Promise<JoinMatchResponse>
}

export type MatchApiServiceFactory = <
  MS extends IMatchState = IMatchState,
  PS extends IPlayerState = IPlayerState
>() => IMatchService<MS, PS>

export function createMatchApiServiceFactory({
  apiServiceFactory,
  apiClient,
  wsUrl
}: Dependencies): MatchApiServiceFactory {
  return <
    MS extends IMatchState = IMatchState,
    PS extends IPlayerState = IPlayerState
  >() => {
    const apiBase = apiServiceFactory<
      MatchResponse<MS, PS>,
      CreateMatchRequest<MS>,
      UpdateMatchRequest<MS, PS>
    >('matches')

    function connect<MS>(code: string, player: string) {
      const websocket = new WebSocket(`${wsUrl}/match/${code}/${player}`)

      const matchUpdates$ = new Subject<MatchResponse<MS, PS>>()
      const playerJoin$ = new Subject<string>()
      const playerLeft$ = new Subject<string>()

      websocket.onmessage = (evt) => {
        const message: WebSocketMessage = JSON.parse(evt.data)

        switch (message.content.event) {
          case MatchUpdateEvent.STATE_UPDATE:
            matchUpdates$.next(message.content.data as MatchResponse<MS, PS>)
            break
          case MatchUpdateEvent.PLAYER_JOIN:
            playerJoin$.next(message.sender)
            break
          case MatchUpdateEvent.PLAYER_LEFT:
            playerLeft$.next(message.sender)
            break
          default:
            break
        }
      }

      return { matchUpdates$, playerJoin$, playerLeft$ }
    }

    async function join(code: string, payload: JoinMatchRequest<PS>) {
      const response = await apiClient.post<JoinMatchResponse>(
        `matches/${code}/join`,
        payload
      )

      return response.data
    }

    return {
      ...apiBase,
      connect,
      join
    }
  }
}

// export function createMatchService<MS extends IMatchState = IMatchState,PS extends IPlayerState = IPlayerState>({ apiServiceFactory, apiClient, wsUrl }: Dependencies): IMatchService<MS,PS> {

// }

// export interface IMatchService {
//   get: <MS, PS>(code: string) => Promise<MatchResponse<MS, PS>>
//   create: <MS, PS>(
//     request: CreateMatchRequest<MS, PS>
//   ) => Promise<CreateMatchResponse>
//   update: <MS, PS>(
//     code: string,
//     request: UpdateMatchRequest<MS, PS>
//   ) => Promise<UpdateMatchResponse<MS>>
//   connect: <MS>(code: string, player: string) => MatchSubscription<MS>
// }

// export function createMatchService({
//   apiUrl,
//   wsUrl
// }: Dependencies): IMatchService {
//   const apiClient = axios.create({ baseURL: apiUrl })

//   async function get<MS, PS>(code: string) {
//     const response = await apiClient.get<MatchResponse<MS, PS>[]>(
//       `matches/?code=${code}`
//     )

//     return response.data[0]
//   }

//   async function create<MS, PS>(request: CreateMatchRequest<MS, PS>) {
//     const response = await apiClient.post<CreateMatchResponse>(
//       'matches',
//       request
//     )

//     return response.data
//   }

//   async function update<MS, PS>(
//     code: string,
//     request: UpdateMatchRequest<MS, PS>
//   ) {
//     const response = await apiClient.patch<UpdateMatchResponse<MS>>(
//       `matches/${code}`,
//       request
//     )

//     return response.data
//   }

//   function connect<MS>(code: string, player: string) {
//     const websocket = new WebSocket(`${wsUrl}/match/${code}/${player}`)

//     const matchUpdates$ = new Subject<UpdateMatchResponse<MS>>()
//     const playerJoin$ = new Subject<string>()
//     const playerLeft$ = new Subject<string>()

//     websocket.onmessage = (evt) => {
//       const message: WebSocketMessage = JSON.parse(evt.data)

//       switch (message.content.event) {
//         case MatchUpdateEvent.STATE_UPDATE:
//           matchUpdates$.next(message.content.data as UpdateMatchResponse<MS>)
//           break
//         case MatchUpdateEvent.PLAYER_JOIN:
//           playerJoin$.next(message.sender)
//           break
//         case MatchUpdateEvent.PLAYER_LEFT:
//           playerLeft$.next(message.sender)
//           break
//         default:
//           break
//       }
//     }

//     return { matchUpdates$, playerJoin$, playerLeft$ }
//   }

//   return {
//     get,
//     create,
//     update,
//     connect
//   }
// }
