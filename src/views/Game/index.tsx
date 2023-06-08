import React from 'react'
import { useGameStore } from '../../stores'

export function Game() {
  const game = useGameStore((state) => state.current)

  return game ? (
    <GameSelected>The selected game is {game.name}</GameSelected>
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
