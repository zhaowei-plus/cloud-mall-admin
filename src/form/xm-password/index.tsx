import React from 'react'
import { Input } from 'antd'
import { IForm } from '@/assets/constant'

export default (props: IForm) => {
  const { value = '', onChange, placeholder, disabled = false, ...rest } = props
  const handleChange = (e: any) => {
    onChange(e.target.value)
  }

  // 文本态
  if (disabled) {
    return <span>********</span>
  }

  // 编辑态
  return (
    <Input.Password
      value={value}
      onChange={handleChange}
      visibilityToggle={false}
      placeholder={placeholder}
      {...rest}
    />
  )
}
