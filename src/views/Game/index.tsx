import React, { useCallback, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { shallow } from 'zustand/shallow'
import pick from 'lodash/pick'
import { ContainerContext } from '@play/context'

export function Game() {
  const { gameId } = useParams()
  const container = useContext(ContainerContext)
  const useGameStore = container.resolve('useGameStore')

  const { fetchOne, select } = useGameStore(
    (state) => pick(state, 'fetchOne', 'select'),
    shallow
  )
  const navigate = useNavigate()

  useEffect(() => {
    const id = parseInt(gameId || '0')
    console.log('id is ', id)
    fetchOne(id)
      .then(() => select(id))
      .catch(() => navigate('/not-found'))
  }, [gameId, fetchOne, select, navigate])

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
