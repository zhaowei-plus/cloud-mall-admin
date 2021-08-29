import React from 'react'
import { Switch, message } from 'antd'

import './index.less'

const SwitchField = (props: any) => {
  const { value, editable = true, mutators } = props

  const { message } = props.props['x-props']

  return (
    <div className="switch-field">
      <Switch
        disabled={!editable}
        defaultChecked={value}
        onChange={mutators.change}
      />
      <span className="message">{message}</span>
    </div>
  )
}

SwitchField.isFieldComponent = true

export default SwitchField
