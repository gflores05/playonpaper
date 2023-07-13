import { ContainerContext } from '@play/context'
import { slugToPascal } from '@play/util'
import { pick } from 'lodash'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { shallow } from 'zustand/shallow'
import { IMatchFactory } from '../match-factory'
import { MatchStatus } from '../types'

export function useCanLoadGame() {
  const navigate = useNavigate()
  const container = useContext(ContainerContext)

  const useMatchRootStore = container.resolve('useMatchRootStore')
  const game = useMatchRootStore((state) => state.game)

  useEffect(() => {
    if (!game.id) {
      navigate('/games')
    }
  }, [game, navigate])

  const canLoadGame = useMemo(() => game.id !== 0, [game])

  return canLoadGame
}

export type NewGameFormValues = {
  challenger: string
}

export type JoinGameFormValues = {
  code: string
  name: string
}

export function useStartGame() {
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

  return { game, createMatch, joinGame }
}
