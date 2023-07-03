import { ReactNode } from 'react'

interface LoadingStateProps {
  children?: ReactNode
}
export const LoadingState = ({ children }: LoadingStateProps) => {
  return <h1 className="text-white text-2xl">{children || 'Loading...'}</h1>
}
