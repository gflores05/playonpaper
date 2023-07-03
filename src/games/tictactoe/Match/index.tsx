import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Subject } from 'rxjs'
import useSwr from 'swr'
import { ContainerContext } from '@play/context'
import { Container, ErrorState, LoadingState } from '@play/components'
import { TicTacToeBoard } from '../Board'
import { TicTacToeMatchState, TicTacToePlayerState } from '../types'
import { MatchResponse } from '@play/games/match-service'

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

  const init = async () => {
    const { playerJoin$, playerLeft$, matchUpdates$ } = await subscribe(
      code || ''
    )

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
      <TicTacToeBoard />
    </Container>
  )
}
