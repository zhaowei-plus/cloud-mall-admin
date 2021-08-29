import React from 'react'
import { InputNumber } from 'antd'

import './index.less'

const InputRange = (props: any) => {
  const { value = {}, mutators } = props
  const { placeholder } = props.props['x-props']
  // const { max } = props.props['x-component-props']

  const handleMinChange = min => {
    mutators.change({ ...value, min })
  }

  const handleMaxChange = max => {
    mutators.change({ ...value, max })
  }

  return (
    <div className="input-range">
      <InputNumber
        onChange={handleMinChange}
        placeholder={placeholder}
        value={value.min}
      />
      <span className="part">~</span>
      <InputNumber
        onChange={handleMaxChange}
        placeholder={placeholder}
        value={value.max}
      />
    </div>
  )
}

InputRange.isFieldComponent = true

export default InputRange
