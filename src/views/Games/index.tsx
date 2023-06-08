import React, { useEffect } from 'react'
import { useGameStore } from '../../stores'

export function Games() {
  const games = useGameStore((state) => state.games)
  const select = useGameStore((state) => state.select)
  const fetch = useGameStore((state) => state.fetch)

  useEffect(() => {
    fetch().then()
  }, [fetch])

  return (
    <table className="w-full border-collapse border border-slate-400">
      <thead>
        <tr className="font-bold text-white">
          <GameTableHeader>Id</GameTableHeader>
          <GameTableHeader>Name</GameTableHeader>
          <GameTableHeader>Code</GameTableHeader>
          <GameTableHeader></GameTableHeader>
        </tr>
      </thead>
      <tbody>
        {games.map((game) => (
          <tr className="text-white" key={game.id}>
            <GameTableCell>{game.id}</GameTableCell>
            <GameTableCell>{game.name}</GameTableCell>
            <GameTableCell>{game.code}</GameTableCell>
            <GameTableCell>
              <button onClick={() => select(game)} type="button">
                View
              </button>
            </GameTableCell>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

interface GameTableHeaderProps {
  children?: string
}
function GameTableHeader({ children }: GameTableHeaderProps) {
  return <th className="border border-slate-300">{children}</th>
}

interface GameTableCellProps {
  children: React.ReactNode
}
function GameTableCell({ children }: GameTableCellProps) {
  return <td className="border border-slate-300">{children}</td>
}
