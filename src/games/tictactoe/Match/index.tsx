import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useSwr from 'swr'
import { pick } from 'lodash'
import { Subscription } from 'rxjs'
import { ContainerContext } from '@play/context'
import { Container, ErrorState, LoadingState, Title } from '@play/components'
import { TicTacToeBoard } from '../Board'
import { shallow } from 'zustand/shallow'

export function TicTacToeMatch() {
  const container = useContext(ContainerContext)

  const useMatchRootStore = container.resolve('useMatchRootStore')
  const useMatchStore = container.resolve('useTicTacToeMatchStore')
  const { code = '' } = useParams()

  const subscribe = useMatchStore((state) => state.subscribe)
  const match = useMatchStore((state) => state.match)
  const { playerJoin$, playerLeft$ } = useMatchStore(
    (state) => pick(state, 'matchUpdates$', 'playerJoin$', 'playerLeft$'),
    shallow
  )
  const player = useMatchRootStore((state) => state.name)
  const pmp = useMatchRootStore((state) => state.pmp)

  const init = async () => {
    await subscribe(code, player, pmp || '')
  }

  useEffect(() => {
    let subscription: Subscription

    if (playerJoin$) {
      subscription = playerJoin$.subscribe((player) => {
        toast(`${player} has joined the game!`, { type: 'info' })
      })
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [playerJoin$])

  useEffect(() => {
    let subscription: Subscription

    if (playerLeft$) {
      subscription = playerLeft$.subscribe((player) => {
        toast(`${player} has left the game!`, { type: 'info' })
      })
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [playerLeft$])

  const { isLoading, error } = useSwr('/match-subscription', init)

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
      {match.state.winner ? (
        <Title type="t2">The winner is {match.state.winner}</Title>
      ) : (
        <Title>
          {match.state.currentPlayer
            ? match.state.currentPlayer === player
              ? `Is your turn`
              : `Is the turn of ${match.state.currentPlayer}`
            : 'Waiting for the other player to join'}
        </Title>
      )}
      <TicTacToeBoard />
    </Container>
  )
}
