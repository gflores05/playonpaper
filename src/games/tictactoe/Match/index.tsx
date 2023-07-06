import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Subject } from 'rxjs'
import useSwr from 'swr'
import _ from 'lodash'
import { ContainerContext } from '@play/context'
import { Container, ErrorState, LoadingState, Title } from '@play/components'
import { TicTacToeBoard } from '../Board'
import { TicTacToeMatchState, TicTacToePlayerState } from '../types'
import { MatchResponse } from '@play/games'

export function Match() {
  const container = useContext(ContainerContext)

  const useMatchStore = container.resolve('useTicTacToeMatchStore')
  const { code } = useParams()

  const [playerJoin, setPlayerJoin] = useState<Subject<string>>(new Subject())
  const [playerLeft, setPlayerLeft] = useState<Subject<string>>(new Subject())
  const [matchUpdates, setMatchUpdate] = useState<
    Subject<MatchResponse<TicTacToeMatchState, TicTacToePlayerState>>
  >(new Subject())

  const subscribe = useMatchStore((state) => state.subscribe)
  const match = useMatchStore((state) => state.match)
  const [currentPlayer, setCurrentPlayer] = useState(
    match.state.currentPlayer ||
      _(match.players)
        .pickBy((val) => val.state.token === 'X')
        .keys()
        .first()
  )

  const init = async () => {
    const { playerJoin$, playerLeft$, matchUpdates$ } = await subscribe(
      code || ''
    )

    matchUpdates$.subscribe((updates) => {
      setCurrentPlayer(updates.state.currentPlayer)
    })

    playerJoin$.subscribe((player) => {
      toast(`${player} has joined the game!`, { type: 'info' })
    })

    playerLeft$.subscribe((player) => {
      toast(`${player} has left the game!`, { type: 'info' })
    })

    setMatchUpdate(matchUpdates$)
    setPlayerJoin(playerJoin$)
    setPlayerLeft(playerLeft$)
  }

  const { isLoading, error } = useSwr('/match-subscription', init)

  useEffect(() => {
    return () => {
      matchUpdates.unsubscribe()
      playerJoin.unsubscribe()
      playerLeft.unsubscribe()
    }
  }, [playerJoin, playerLeft, matchUpdates])

  if (error) {
    return (
      <ErrorState>
        An error has occurred fetching the data: {error.message}
      </ErrorState>
    )
  }

  if (isLoading) {
    return <LoadingState>Loading...</LoadingState>
  }

  return (
    <Container>
      <Title>
        {currentPlayer
          ? `Is the turn of ${currentPlayer}`
          : 'Waiting for the other player to join'}
      </Title>
      {match.state.winner && (
        <Title type="t2">The winner is {match.state.winner}</Title>
      )}
      <TicTacToeBoard />
    </Container>
  )
}
