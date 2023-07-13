import { useForm } from 'react-hook-form'
import {
  Container,
  Title,
  Row,
  CopyButton,
  Form,
  Input,
  Button,
  ErrorState,
  LoadingState
} from '@play/components'
import { TicTacToeMatch } from '@play/games/tictactoe'
import { RestoreMatchForm, useMatch } from './match-hook'
import { memo } from 'react'
interface ConcreteMatchProps {
  slug: string
}

function ConcreteMatch({ slug }: ConcreteMatchProps) {
  switch (slug) {
    case 'tic-tac-toe':
      return <TicTacToeMatch />
  }
  return <></>
}

interface CopyCodesProps {
  code: string
  pmp: string
}

const CopyCodes = memo(function CopyCodes({ code, pmp }: CopyCodesProps) {
  return (
    <Row columns={1}>
      <Title type="t2">
        Send this code to your friends so they can join the game: {code}{' '}
        <CopyButton value={code} message="Game code copied to clipboard" />
      </Title>
      <Title type="t2">
        Save this code if you want to leave the game and restore it later{' '}
        <CopyButton value={pmp} message="Pmp copied to clipboard" />
      </Title>
    </Row>
  )
})

export function Match() {
  const { error, isLoading, pmp, code, game, onRestoreMatch } = useMatch()

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

  if (!pmp) {
    return <RestoreMatch onRestoreMatch={onRestoreMatch} />
  }

  return (
    <Container>
      <CopyCodes code={code} pmp={pmp} />
      <Row columns={1}>
        <ConcreteMatch slug={game.slug} />
      </Row>
    </Container>
  )
}

interface RestoreMatchProps {
  onRestoreMatch: (data: RestoreMatchForm) => Promise<void>
}

const RestoreMatch = memo(({ onRestoreMatch }: RestoreMatchProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RestoreMatchForm>()

  return (
    <Form legend="New Game" onSubmit={handleSubmit(onRestoreMatch)}>
      <Input
        {...register('name', { required: true })}
        error={errors?.name?.message}
        label="Write your name"
        orientation="col"
      />
      <Input
        {...register('pmp', { required: true })}
        error={errors?.pmp?.message}
        label="Write your PMP"
        orientation="col"
      />
      <Button type="submit" mode="primary">
        Restore
      </Button>
    </Form>
  )
})
