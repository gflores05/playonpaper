import { ReactNode } from 'react'

interface ErrorStateProps {
  children: ReactNode
}
export function ErrorState({ children }: ErrorStateProps) {
  return <h1 className="text-red-900 text-2xl">{children}</h1>
}
