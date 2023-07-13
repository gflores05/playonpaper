import { pick } from 'lodash'
import { MatchResponse } from './match-service'
import { IMatchState, IPlayerState, Match, MatchStatus } from './types'

export function mapMatch<MS extends IMatchState, PS extends IPlayerState>(
  match: MatchResponse<MS, PS>
): Match<MS, PS> {
  return {
    ...pick(match, ['id', 'state', 'code', 'game']),
    status: MatchStatus[match.status as keyof typeof MatchStatus],
    start: new Date(match.start_date),
    end: new Date(match.end_date),
    players: match.players
  }
}
