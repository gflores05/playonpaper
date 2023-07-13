import { useForm } from 'react-hook-form'
import { Button, Container, Form, Input, Title } from '@play/components'
import {
  JoinGameFormValues,
  NewGameFormValues,
  useCanLoadGame,
  useStartGame
} from './start-game-hook'

export function StartGame() {
  const canLoadGame = useCanLoadGame()

  if (!canLoadGame) {
    return <></>
  }

  return <StartGameContent />
}

function StartGameContent() {
  const { game, createMatch, joinGame } = useStartGame()

  return (
    <Container>
      <Title type="t2">{game.name}</Title>
      <NewGame onCreateGame={createMatch} />
      <JoinGame onJoinGame={joinGame} />
    </Container>
  )
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
