'use client'

import { Avatar, Flex } from 'antd'
import React from 'react'

export default function AlphabeticAvatar({
  src,
  letter,
  rounded,
  label,
  colored,
  id,
  withBorder,
  small,
}: {
  src: string | undefined
  letter: string
  rounded?: boolean
  colored?: boolean
  label?: string
  id?: number
  withBorder?: boolean
  small?: boolean
}) {
  return label ? (
    <Flex gap={2} vertical justify="center" align="center" className="cursor-pointer">
      <Avatar
        src={src}
        shape={rounded ? 'circle' : 'square'}
        className={`blurry-avatar ${colored ? 'colored' : ''} ${withBorder ? 'with-border' : ''}`}
        style={
          {
            '--group-color': `hsl(${Math.floor(+letter * 10 + (id || 0) * 10)}, 70%, 60%)`,
          } as React.CSSProperties
        }
      >
        <div className="bg-blur"></div>
        <span className="initials">{letter?.toLocaleUpperCase()}</span>
      </Avatar>
      {label && (
        <span title={label} className="one-line-text d-block text-xs">
          {label?.length > 15 ? label?.substring?.(0, 15) + '...' : label}
        </span>
      )}
    </Flex>
  ) : (
    <Avatar
      src={src}
      shape={rounded ? 'circle' : 'square'}
      className={`blurry-avatar ${colored ? 'colored' : ''} ${small ? 'small !mt-1' : ''}`}
    >
      <div className="bg-blur"></div>
      <span className="initials">{letter?.toLocaleUpperCase()}</span>
    </Avatar>
  )
}
