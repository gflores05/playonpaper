import { useCallback, useContext } from 'react'
import { shallow } from 'zustand/shallow'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useSwr from 'swr'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { pick } from 'lodash'
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
import { ContainerContext } from '@play/context'
import { TicTacToeMatch } from '@play/games/tictactoe'
interface ConcretMatchProps {
  slug: string
}

function ConcreteMatch({ slug }: ConcretMatchProps) {
  switch (slug) {
    case 'tic-tac-toe':
      return <TicTacToeMatch />
  }
  return <></>
}

export function Match() {
  const container = useContext(ContainerContext)

  const { code = '' } = useParams()

  const useMatchRootStore = container.resolve('useMatchRootStore')
  const {
    game,
    pmp = '',
    fetchByCode
  } = useMatchRootStore(
    (state) => pick(state, 'game', 'pmp', 'fetchByCode'),
    shallow
  )

  const { error, isLoading } = useSwr('/fetchMatchByCode', () =>
    fetchByCode(code)
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

  if (!pmp) {
    return <RestoreMatch />
  }

  return (
    <Container>
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
      <Row columns={1}>
        <ConcreteMatch slug={game.slug} />
      </Row>
    </Container>
  )
}

type RestoreMatchForm = {
  pmp: string
  name: string
}

function isAxiosError(error: any): error is AxiosError {
  return 'response' in error
}

const RestoreMatch = () => {
  const container = useContext(ContainerContext)

  const { code = '' } = useParams()

  // Get the Match Factory
  const useMatchRootStore = container.resolve('useMatchRootStore')

  const join = useMatchRootStore((state) => state.join)

  const onRestoreMatch = useCallback(
    async (data: RestoreMatchForm) => {
      try {
        await join(code, {
          name: data.name,
          state: {},
          pmp: data.pmp
        })
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.code === AxiosError.ERR_BAD_REQUEST) {
            toast.error('Invalid name or pmp')
          }
        }
      }
    },
    [code, join]
  )

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
}
