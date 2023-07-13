import { useCallback, useContext, useEffect } from 'react'
import { pick } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button, Container, Form, Input, Title } from '@play/components'
import { ContainerContext } from '@play/context'
import { slugToPascal } from '@play/util/string-util'
import { IMatchFactory, MatchStatus } from '@play/games'
import { shallow } from 'zustand/shallow'

export function StartGame() {
  const navigate = useNavigate()
  const container = useContext(ContainerContext)

  const useMatchRootStore = container.resolve('useMatchRootStore')
  const game = useMatchRootStore((state) => state.game)

  useEffect(() => {
    if (!game.id) {
      navigate('/games')
    }
  }, [game, navigate])

  if (!game.id) {
    return <></>
  }

  return <StartGameContent />
}

function StartGameContent() {
  const navigate = useNavigate()
  const container = useContext(ContainerContext)

  const useMatchRootStore = container.resolve('useMatchRootStore')

  const { create, join, update, game } = useMatchRootStore(
    (state) => pick(state, 'create', 'join', 'update', 'game'),
    shallow
  )

  // Get the Match Factory
  const pascalGame = slugToPascal(game.slug)
  const {
    getInitialMatchState,
    getInitialPlayerState,
    getJoinPlayerState,
    getJoinInitialState
  } = container.resolve<IMatchFactory>(`factory${pascalGame}`)

  // The match store
  const createMatch = useCallback(
    async (data: NewGameFormValues) => {
      const match = await create(getInitialMatchState())

      await join(match.code, {
        name: data.challenger,
        state: getInitialPlayerState()
      })

      navigate(`/games/${match.code}`)
    },
    [create, getInitialMatchState, getInitialPlayerState, join, navigate]
  )

  const joinGame = useCallback(
    async (data: JoinGameFormValues) => {
      const match = await join(data.code, {
        name: data.name,
        state: getJoinPlayerState()
      })

      await update(
        match.id,
        MatchStatus.PLAYING,
        getJoinInitialState(data.name, match)
      )
      navigate(`/games/${data.code}`)
    },
    [join, getJoinPlayerState, update, getJoinInitialState, navigate]
  )

  return (
    <Container>
      <Title type="t2">{game.name}</Title>
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
