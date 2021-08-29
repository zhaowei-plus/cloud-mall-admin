import React from 'react'
import { Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import './index.less'

export default (props: any) => {
  const { value, onChange, disabled = false } = props
  const { action, message } = props

  const uploadProps = {
    action,
    disabled,
    showUploadList: false,
    onSuccess: ({ data }) => {
      onChange(data)
    },
    onError: error => {
      onChange()
    },
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">{message}</div>
    </div>
  )

  return (
    <div className="picture">
      <Upload
        {...uploadProps}
        listType="picture-card"
        className="picture-upload"
      >
        {value ? (
          <img className="picture-upload__preview" src={value} />
        ) : (
          uploadButton
        )}
      </Upload>
    </div>
  )
}
