import React, { useEffect } from 'react'
import { Checkbox } from 'antd'

import { Preview } from '@/components'

import './index.less'

const RemindWay = props => {
  const { value = true, editable = true, mutators } = props
  const { tips, content, previewUrl } = props.props['x-props']

  const handleChange = e => {
    mutators.change(e.target.checked)
  }

  const handlePreview = () => {
    if (previewUrl) {
      Preview.gif(previewUrl)
    }
  }

  useEffect(() => {
    mutators.change(value)
  }, [])

  return (
    <div className="remind-way">
      <div className="remind-way__header">
        {editable && (
          <Checkbox
            checked={value}
            disabled={!editable}
            onChange={handleChange}
          />
        )}
        <span className="title">{tips}</span>
      </div>
      <div className="remind-way__content">{content}</div>
      <div className="remind-way__footer">
        <a onClick={handlePreview}>样式预览</a>
      </div>
    </div>
  )
}

RemindWay.isFieldComponent = true

export default RemindWay
