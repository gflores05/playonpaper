import cx from 'classnames'

export type ButtonMode = 'default' | 'primary' | 'success' | 'danger'

const ButtonColors: { [key: string]: string } = {
  default: 'bg-white hover:bg-slate-50',
  primary: 'bg-sky-500 hover:bg-sky-400',
  success: 'bg-green-500 hover:bg-green-400',
  danger: 'bg-red-500 hover:bg-red-400'
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  mode: ButtonMode
}
export const Button = ({ mode, children, onClick, ...rest }: ButtonProps) => {
  return (
    <button
      className={cx(
        ButtonColors[mode],
        'rounded-md',
        mode === 'default' ? 'text-gray-500' : 'text-white',
        'font-bold',
        'py-2',
        'px-4'
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  )
}
