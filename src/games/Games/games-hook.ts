import { pick } from 'lodash'
import { useContext } from 'react'
import { shallow } from 'zustand/shallow'
import useSwr from 'swr'
import { ContainerContext } from '@play/context'

export function useGames() {
  const container = useContext(ContainerContext)
  const useGameStore = container.resolve('useGameStore')

  const { items: games, fetch } = useGameStore(
    (state) => pick(state, 'items', 'fetch'),
    shallow
  )

  const { error, isLoading } = useSwr('/games', () => fetch())

  return { games, error, isLoading }
}
