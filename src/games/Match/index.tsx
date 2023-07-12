import { useContext } from 'react'
import { shallow } from 'zustand/shallow'
import { useParams } from 'react-router-dom'
import { Container, Title, Row, CopyButton } from '@play/components'
import { ContainerContext } from '@play/context'
import { TicTacToeMatch } from '@play/games/tictactoe'
interface ConcretMatchProps {
  slug: string
}

function ConcretMatch({ slug }: ConcretMatchProps) {
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
  const { slug, pmp } = useMatchRootStore((state) => state, shallow)
  console.log('pmp: ', pmp)

  return (
    <Container>
      <Row columns={1}>
        <Title type="t2">
          Send this code to your friends so they can join the game: {code}{' '}
          <CopyButton value={code} message="Game code copied to clipboard" />
        </Title>
        <Title type="t2">
          Save this code if you want to leave the game and restore it later{' '}
          <CopyButton value={pmp || ''} message="Pmp copied to clipboard" />
        </Title>
      </Row>
      <Row columns={1}>
        <ConcretMatch slug={slug} />
      </Row>
    </Container>
  )
}
