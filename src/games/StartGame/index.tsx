import { useCallback, useContext, useEffect } from 'react'
import { pick } from 'lodash'
import { useNavigate } from 'react-router-dom'
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
import { IMatchViewModel, MatchStatus } from '@play/games'

export function StartGame() {
  const navigate = useNavigate()
  const container = useContext(ContainerContext)

  const useMatchRootStore = container.resolve('useMatchRootStore')
  const slug = useMatchRootStore((state) => state.slug)

  useEffect(() => {
    if (!slug) {
      navigate('/games')
    }
  }, [slug, navigate])

  if (!slug) {
    return <></>
  }

  return <StartGameContent />
}

function StartGameContent() {
  const navigate = useNavigate()
  const container = useContext(ContainerContext)

  const useMatchRootStore = container.resolve('useMatchRootStore')

  const setPmp = useMatchRootStore((state) => state.setPmp)
  const slug = useMatchRootStore((state) => state.slug)

  // Fetch the game
  const useGameStore = container.resolve('useGameStore')

  const { fetch, items: games } = useGameStore((state) =>
    pick(state, 'fetch', 'items')
  )
  const { error, isLoading } = useSwr('/games', () => fetch({ slug }))

  // Get the MatchVM
  const pascalGame = slugToPascal(slug || '')
  const {
    useMatchStore,
    getInitialMatchState,
    getInitialPlayerState,
    getJoinPlayerState,
    getJoinInitialState
  } = container.resolve<IMatchViewModel>(`create${pascalGame}VM`)

  // The match store
  const create = useMatchStore((state) => state.create)
  const join = useMatchStore((state) => state.join)
  const update = useMatchStore((state) => state.update)

  const createMatch = useCallback(
    async (data: NewGameFormValues) => {
      const match = await create(games.first()?.id || 0, getInitialMatchState())

      const [pmp] = await join(match.code, {
        name: data.challenger,
        state: getInitialPlayerState()
      })

      setPmp(pmp)

      navigate(`/games/${match.code}`)
    },
    [
      create,
      games,
      getInitialMatchState,
      setPmp,
      getInitialPlayerState,
      join,
      navigate
    ]
  )

  const joinGame = useCallback(
    async (data: JoinGameFormValues) => {
      const [pmp, match] = await join(data.code, {
        name: data.name,
        state: getJoinPlayerState()
      })

      await update(
        MatchStatus.PLAYING,
        {},
        getJoinInitialState(data.name, match)
      )

      setPmp(pmp)

      navigate(`/games/${data.code}`)
    },
    [join, getJoinPlayerState, update, getJoinInitialState, navigate, setPmp]
  )

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
      <NewGame onCreateGame={createMatch} />
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
