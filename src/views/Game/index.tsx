import React, { useCallback, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { shallow } from 'zustand/shallow'
import pick from 'lodash/pick'
import useSwr from 'swr'
import { ContainerContext } from '@play/context'
import { ErrorState } from '@play/components'

export function Game() {
  const { gameId } = useParams()
  const container = useContext(ContainerContext)
  const useGameStore = container.resolve('useGameStore')

  const { fetchOne, select } = useGameStore(
    (state) => pick(state, 'fetchOne', 'select'),
    shallow
  )
  const navigate = useNavigate()

  const { error, isLoading } = useSwr(`/game${gameId}`, async () => {
    const id = parseInt(gameId || '0')

    try {
      await fetchOne(id)
      select(id)
    } catch (error) {
      if (
        (error as { response: { status: number } }).response?.status === 404
      ) {
        return navigate('/not-found')
      }
      throw error
    }
  })

  const game = useGameStore((state) => state.current)
  const updateLocal = useGameStore((state) => state.set)
  const update = useGameStore((state) => state.update)

  const onChangeName = useCallback(
    (evt: React.FormEvent<HTMLInputElement>) => {
      updateLocal({ id: game?.id || 0, name: evt.currentTarget.value })
    },
    [game, updateLocal]
  )

  const onSave = useCallback(async () => {
    if (game) {
      await update(game.id, { name: game.name, configuration: {} })
      toast('Game saved!', { type: 'success' })
    }
  }, [update, game])

  if (error) {
    return (
      <ErrorState>
        An error has occurred fetching the data: {error.message}
      </ErrorState>
    )
  }

  if (isLoading) {
    return <h1 className="text-white text-2xl">Loading...</h1>
  }

  return game ? (
    <>
      <input onChange={onChangeName} value={game.name} />
      <button className="bg-white" onClick={onSave} type="button">
        Save
      </button>
      <ToastContainer />
      <GameSelected>The selected game is {game.name}</GameSelected>
    </>
  ) : (
    <GameSelected>No game selected</GameSelected>
  )
}

interface GameSelectedProps {
  children?: React.ReactNode
}
function GameSelected({ children }: GameSelectedProps) {
  return <h2 className="text-white text-center text-2xl mt-16">{children}</h2>
}
