import { ReactNode } from 'react'

export default function SquareBtn({
  className,
  ref,
  icon,
  handleClick,
  primary,
  small,
  danger,
  outlined,
  meduim,
  active,
  disabled,
}: {
  ref?: any
  danger?: boolean
  className?: string
  outlined?: boolean
  primary?: boolean
  active?: boolean
  icon: ReactNode
  handleClick: any
  small?: boolean
  meduim?: boolean
  disabled?: boolean
}) {
  return (
    <div
      ref={ref}
      className={`${disabled ? '!cursor-no-drop !bg-gray-500' : ''} ${className ? className : ''} square-btn ${outlined ? 'outlined' : ''} ${active ? 'active' : ''} ${primary ? 'primary' : ''} 
        ${small ? 'small' : ''} ${danger ? 'danger' : ''} 
        ${meduim ? 'meduim' : ''}`}
      onClick={handleClick}
    >
      {icon}
    </div>
  )
}
