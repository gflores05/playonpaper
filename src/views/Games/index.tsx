import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import pick from 'lodash/pick'
import { ContainerContext } from '@play/context'

export function Games() {
  const container = useContext(ContainerContext)
  const useGameStore = container.resolve('useGameStore')

  const { items: games, fetch } = useGameStore((state) =>
    pick(state, 'items', 'fetch')
  )

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
              <Link to={`/games/${game.id}`}>View</Link>
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
