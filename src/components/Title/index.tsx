interface TitleProps {
  children: React.ReactNode
  type?: 't1' | 't2' | 't3' | 't4'
}

export function Title({ children, type }: TitleProps) {
  switch (type) {
    case 't2':
      return <h2 className="text-2xl text-black">{children}</h2>
    case 't3':
      return <h2 className="text-xl text-black">{children}</h2>
    case 't4':
      return <h2 className="text-lg text-black">{children}</h2>
    default:
      return <h1 className="text-3xl text-black">{children}</h1>
  }
}
