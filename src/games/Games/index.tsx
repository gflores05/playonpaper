import { useContext } from 'react'
import useSwr from 'swr'
import pick from 'lodash/pick'
import { ContainerContext } from '@play/context'
import {
  Button,
  Container,
  ErrorState,
  Grid,
  LoadingState
} from '@play/components'
import { ImageLogos } from '@play/assets'
import { Game } from '../types'
import { useNavigate } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

export const Games = () => {
  const container = useContext(ContainerContext)
  const useGameStore = container.resolve('useGameStore')

  const { items: games, fetch } = useGameStore(
    (state) => pick(state, 'items', 'fetch'),
    shallow
  )

  const { error, isLoading } = useSwr('/games', () => fetch())

  if (error) {
    return (
      <ErrorState>
        An error has occurred fetching the data: {error.message}
      </ErrorState>
    )
  }

  if (isLoading) {
    ;<LoadingState />
  }

  return (
    <Container>
      <Grid cols={4} gap={12}>
        {games.map((game) => (
          <GameTile game={game} key={game.id} />
        ))}
      </Grid>
    </Container>
  )
}

interface GameTileProps {
  game: Game
}

function GameTile({ game }: GameTileProps) {
  const navigate = useNavigate()
  const container = useContext(ContainerContext)
  const useMatchRootStore = container.resolve('useMatchRootStore')

  const setGame = useMatchRootStore((state) => state.setGame)

  const onStartGame = () => {
    setGame(game)
    navigate(`/games/new`)
  }

  return (
    <div className="flex flex-col">
      <img src={ImageLogos[game.slug]} alt={game.name} />
      <h2 className="text-2xl text-center my-8">{game.name}</h2>
      <Button mode="primary" onClick={onStartGame}>
        Play
      </Button>
    </div>
  )
}
