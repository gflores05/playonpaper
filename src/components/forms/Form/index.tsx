import { ReactNode } from 'react'

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  legend?: string
  children: ReactNode
}

export function Form({ legend, children, ...rest }: FormProps) {
  return (
    <form className="flex flex-col p-4" {...rest}>
      <fieldset>
        {legend && <legend>{legend}</legend>}
        {children}
      </fieldset>
    </form>
  )
}
