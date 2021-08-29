import React, { useState } from 'react'
import { Button, Upload, Modal, Tooltip, Spin, message } from 'antd'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'

import './index.less'

const OrderUpload = (props: any) => {
  const {
    value,
    onChange,
    disabled = false,
    action,
    params = {},
    file,
    ...rest
  } = props

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
        const {
          failUrl,
          errorCount,
          successFileKey,
          friendCommission,
          fileId,
        } = data
        if (errorCount > 0) {
          Modal.error({
            centered: true,
            title: '上传失败',
            content: (
              <div className="error-content">
                <p className="failed-info">
                  存在{errorCount}条上传失败的数据，请下载修改后再上传。
                </p>
                <div className="failed-data">
                  <Tooltip title={name}>
                    <span className="file-name">{name}</span>
                  </Tooltip>
                  <a href={failUrl} target="blank" style={{ margin: 4 }}>
                    下载文件
                  </a>
                </div>
              </div>
            ),
          })
        } else {
          onChange({
            successFileKey,
            friendCommission,
            fileId,
          })
        }
      } else {
        message.error(msg)
      }
    },
    onError: error => {
      console.error('onError:', error)
      onChange()
    },
  }

  const handleDelete = () => {
    onChange()
  }

  const renderInput = () => {
    return (
      <div className="order-upload__input">
        <Spin spinning={loading}>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} style={{ width: 180 }}>
              请上传
            </Button>
          </Upload>
        </Spin>
        <a href={require(`@/assets/files/${file}`)}>模板下载</a>
      </div>
    )
  }

  const renderValue = () => {
    if (value) {
      return (
        <div className="order-upload__value">
          <div className="item">
            <div className="item__label">{value.name || name}</div>
            <div className="item__operation">
              {!disabled && <DeleteOutlined onClick={handleDelete} />}
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="order-upload">
      {!disabled && renderInput()}
      {renderValue()}
    </div>
  )
}

OrderUpload.isFieldComponent = true

export default OrderUpload
