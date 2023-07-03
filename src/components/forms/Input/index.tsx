import React from 'react'
import cx from 'classnames'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  orientation: 'row' | 'col'
  error?: string
}

export const Input = React.forwardRef(function Input(
  { label, orientation, error, ...rest }: InputProps,
  ref?: React.LegacyRef<HTMLInputElement>
) {
  return (
    <div className={cx('flex', `flex-${orientation}`, 'px-4', 'py-4')}>
      {label && <label htmlFor={rest.id}>{label}</label>}
      <input className="py-2 px-4 border-b-2" ref={ref} {...rest} />
      {error && <p className="text-base text-red-500">{error}</p>}
    </div>
  )
})
