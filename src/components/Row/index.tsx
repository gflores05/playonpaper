import cx from 'classnames'

interface RowProps {
  columns: number
  gap?: number
  children?: React.ReactNode
}

const columnClassess = [
  '',
  'columns-1',
  'columns-2',
  'columns-3',
  'columns-4',
  'columns-5',
  'columns-6',
  'columns-7',
  'columns-8',
  'columns-9',
  'columns-10',
  'columns-11',
  'columns-12'
]
const gapClasses = [
  '',
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

export function Row({ columns, gap, children }: RowProps) {
  return (
    <div className={cx(columnClassess[columns], gap && gapClasses[gap])}>
      {children}
    </div>
  )
}
