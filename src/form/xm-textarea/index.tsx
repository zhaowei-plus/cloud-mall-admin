import React from 'react'
import { Input } from 'antd'
import emojiRegex from 'emoji-regex'

const regex = emojiRegex()

export default (props: any) => {
  const { value, onChange, disabled = false, ...rest } = props
  const handleChange = (e: any) => {
    onChange(e.target.value.trim().replace(regex, ''))
  }

  // 文本态
  if (disabled) {
    return <span>{value}</span>
  }

  // 编辑态
  return <Input.TextArea value={value} onChange={handleChange} {...rest} />
}
