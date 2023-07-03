import { useContext } from 'react'
import { pick } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useSwr from 'swr'
import {
  Button,
  Container,
  ErrorState,
  Form,
  Input,
  LoadingState,
  Title
} from '@play/components'
import { ContainerContext } from '@play/context'
import { slugToPascal } from '@play/util/string-util'
import { IMatchViewModel } from '@play/games'

export function StartGame() {
  const container = useContext(ContainerContext)

  // Fetch the game
  const { slug } = useParams()
  const useGameStore = container.resolve('useGameStore')
  const { fetch, items: games } = useGameStore((state) =>
    pick(state, 'fetch', 'items')
  )
  const { error, isLoading } = useSwr('/games', () => fetch({ slug }))

  // Get the MatchVM
  const pascalGame = slugToPascal(slug || '')
  const { useMatchStore, getInitialMatchState, getInitialPlayerState } =
    container.resolve<IMatchViewModel>(`create${pascalGame}VM`)

  // Navigation
  const navigate = useNavigate()

  // The match store
  const create = useMatchStore((state) => state.create)

  const join = useMatchStore((state) => state.join)

  const createGame = async (data: NewGameFormValues) => {
    const match = await create(games.first()?.id || 0, getInitialMatchState(), {
      name: data.challenger,
      state: getInitialPlayerState()
    })

    navigate(`/${slug}/${match.code}`)
  }

  const joinGame = async (data: JoinGameFormValues) => {
    const match = await join(data.code, {
      name: data.name,
      state: getInitialPlayerState()
    })

    navigate(`/${slug}/${match.code}`)
  }

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
      <Title type="t2">{games.first()?.name}</Title>
      <NewGame onCreateGame={createGame} />
      <JoinGame onJoinGame={joinGame} />
    </Container>
  )
}

type NewGameFormValues = {
  challenger: string
}

interface NewGameProps {
  onCreateGame: (data: NewGameFormValues) => Promise<void>
}
function NewGame({ onCreateGame }: NewGameProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<NewGameFormValues>()

  return (
    <Form legend="New Game" onSubmit={handleSubmit(onCreateGame)}>
      <Input
        {...register('challenger')}
        error={errors?.challenger?.message}
        label="Write your name"
        orientation="col"
      />
      <Button type="submit" mode="primary">
        Start
      </Button>
    </Form>
  )
}

type JoinGameFormValues = {
  code: string
  name: string
}

interface JoinGameProps {
  onJoinGame: (data: JoinGameFormValues) => Promise<void>
}

function JoinGame({ onJoinGame }: JoinGameProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<JoinGameFormValues>()

  return (
    <Form legend="Join Game" onSubmit={handleSubmit(onJoinGame)}>
      <Input
        {...register('code')}
        error={errors?.code?.message}
        label="Write the game code"
        orientation="col"
      />
      <Input
        {...register('name')}
        error={errors?.name?.message}
        label="Write your name"
        orientation="col"
      />
      <Button type="submit" mode="primary">
        Start
      </Button>
    </Form>
  )
}
