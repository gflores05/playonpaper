import cx from 'classnames'
import { ReactNode } from 'react'

interface GridProps {
  cols?: number
  rows?: number
  gap?: number
  children: ReactNode
}
const colClasses = [
  'grid-cols-none',
  'grid-cols-1',
  'grid-cols-2',
  'grid-cols-3',
  'grid-cols-4',
  'grid-cols-5',
  'grid-cols-6',
  'grid-cols-7',
  'grid-cols-8',
  'grid-cols-9',
  'grid-cols-10',
  'grid-cols-11',
  'grid-cols-12'
]
const rowClasses = [
  'grid-rows-none',
  'grid-rows-1',
  'grid-rows-2',
  'grid-rows-3',
  'grid-rows-4',
  'grid-rows-5',
  'grid-rows-6',
  'grid-rows-7',
  'grid-rows-8',
  'grid-rows-9',
  'grid-rows-10',
  'grid-rows-11',
  'grid-rows-12'
]
const gapClasses = [
  'gap-0',
  'gap-1',
  'gap-2',
  'gap-3',
  'gap-4',
  'gap-5',
  'gap-6',
  'gap-7',
  'gap-8',
  'gap-9',
  'gap-10',
  'gap-11',
  'gap-12'
]

export function Grid({ cols, rows, gap, children }: GridProps) {
  return (
    <div
      className={cx(
        'grid',
        colClasses[cols || 0],
        rowClasses[rows || 0],
        gapClasses[gap || 0]
      )}
    >
      {children}
    </div>
  )
}
