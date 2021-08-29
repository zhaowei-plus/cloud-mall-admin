import React from 'react'
import { Input } from 'antd'
import emojiRegex from 'emoji-regex'

const regex = emojiRegex()

export default (props: any) => {
  const {
    value,
    onChange,
    disabled = false,
    enableEdit = true, // 自定义属性：是否可编辑
    filter,
    ...rest
  } = props

  const handleChange = (e: any) => {
    onChange(e.target.value.trim().replace(regex, ''))
  }

  const formatValue = typeof filter === 'function' ? filter(value) : value

  // 文本态
  if (disabled) {
    return <span>{formatValue}</span>
  }

  // 编辑态
  return (
    <Input
      value={formatValue}
      disabled={!enableEdit}
      onChange={handleChange}
      {...rest}
    />
  )
}
