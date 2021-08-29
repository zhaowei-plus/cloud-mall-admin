import React from 'react'
import cs from 'classnames'

import './index.less'

interface IRoute {
  name: string
  path: string
  component?: any
  children?: Array<IRoute>
}

interface IMenu {
  key: number
  title: string
  children: Array<IRoute>
}

interface IProps {
  active: number
  menus: Array<IMenu>
  onChange: (key: number) => void
}

export default (props: IProps) => {
  const { active, menus, onChange } = props
  return (
    <div className="category">
      {menus.map(({ key, title }) => (
        <a
          className={cs('item', { active: Number(key) === Number(active) })}
          key={key}
          onClick={() => onChange(key)}
        >
          {title}
        </a>
      ))}
    </div>
  )
}
