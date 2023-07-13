import { Container, ErrorState, LoadingState, Title } from '@play/components'
import { TicTacToeBoard } from '../Board'
import { useTicTacToeMatch } from './match-hook'

export function TicTacToeMatch() {
  const { match, turnMessage, error, isLoading } = useTicTacToeMatch()

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
      <Title>{turnMessage}</Title>
      {match.state.board && <TicTacToeBoard />}
    </Container>
  )
}
