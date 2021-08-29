import React, { useState } from 'react'
import { Button, Upload, Modal, Tooltip, Spin, message } from 'antd'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'

import './index.less'

const FileUpload = (props: any) => {
  const { value, editable = true, mutators } = props
  const { action, file, params = {} } = props.props['x-props']
  const [name, setName] = useState()
  const [loading, setLoading] = useState(false)

  const uploadProps = {
    name: 'file',
    accept: '.xlsx,.xls',
    action,
    data: params,
    showUploadList: false,
    beforeUpload: file => {
      setLoading(true)
      setName(file.name)
      return true
    },
    onSuccess: res => {
      const { success, data = {}, msg } = res
      setLoading(false)
      if (success) {
        mutators.change(data)
      } else {
        message.error(msg)
      }
    },
    onError: error => {
      setLoading(false)
      console.error('onError:', error)
      mutators.change()
    },
  }

  const handleDelete = () => {
    mutators.change()
  }

  const renderInput = () => {
    return (
      <div className="file-upload__input">
        <Spin spinning={loading}>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} style={{ width: 180 }}>
              请上传
            </Button>
          </Upload>
        </Spin>
        <a href={require(`@/assets/files/${file}`)} style={{ marginLeft: 10 }}>
          模板下载
        </a>
      </div>
    )
  }

  const renderValue = () => {
    if (value) {
      return (
        <div className="file-upload__value">
          <div className="item">
            <div className="item__label">
              {value.fileName} 共{value.num}人
            </div>
            <div className="item__operation">
              {editable && <DeleteOutlined onClick={handleDelete} />}
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="file-upload">
      {editable && renderInput()}
      {renderValue()}
    </div>
  )
}

FileUpload.isFieldComponent = true

export default FileUpload
