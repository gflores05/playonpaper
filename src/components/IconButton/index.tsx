import { useCallback } from 'react'
import { Button, ButtonMode } from '../Button'
import { Icon } from '../Icon'

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string
  flat?: boolean
  mode?: ButtonMode
  position?: 'left' | 'right'
}
export function IconButton({
  icon,
  prefix,
  flat,
  mode,
  position = 'left',
  children,
  onClick,
  ...rest
}: IconButtonProps) {
  const flatOnClick = useCallback(
    (evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      evt.preventDefault()
      onClick && onClick(evt as any)
    },
    [onClick]
  )

  return flat ? (
    <a href="/" onClick={flatOnClick}>
      {renderChildren(position, <Icon name={icon} />, children)}
    </a>
  ) : (
    <Button onClick={onClick} mode={mode || 'default'} {...rest}>
      {renderChildren(position, <Icon name={icon} />, children)}
    </Button>
  )
}

function renderChildren(
  position: 'left' | 'right',
  icon: React.ReactNode,
  children?: React.ReactNode
) {
  return (
    <>
      {position === 'left' && icon}
      {children}
      {position === 'right' && icon}
    </>
  )
}
