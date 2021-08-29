import React, { useState } from 'react'
import { Upload, Button, Modal, message, Tooltip } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

import './index.less'

const TEMPLATE = require('@/assets/files/企业导入模板.xlsx')

const BatchImport = props => {
  const { value = {}, mutators, editable = true } = props
  const { materialId } = props.props['x-props']
  const [name, setName] = useState()

  const uploadProps = {
    name: 'file',
    showUploadList: false,
    accept: '.xls,.xlsx',
    action: '/cmmc-market/pubRecord/importOrgs',
    data: {
      materialId,
    },
    beforeUpload: ({ name }) => {
      if (name && name.length > 30) {
        message.warn('文件名长度不能超过30个字符')
        return false
      }
      setName(name)
      return true
    },
    onSuccess: res => {
      const { success, msg, data = {} } = res
      if (!success) {
        message.error(msg)
        return false
      }

      const { orgIds = '', url, errorCount } = data
      if (errorCount > 0) {
        Modal.error({
          centered: true,
          title: '上传失败',
          content: (
            <div className="error-content">
              <p className="failed-info">
                上传中有{errorCount}
                条失败数据，请下载失败标注文件修改后重新上传。
              </p>
              <div className="failed-data">
                失败数据：
                <Tooltip title={name}>
                  <span className="file-name">{name}</span>
                </Tooltip>
                <a href={url} target="blank" style={{ margin: 4 }}>
                  下载文件
                </a>
              </div>
            </div>
          ),
        })
      } else {
        mutators.change({
          name,
          list: orgIds.split(',').map(Number),
        })
      }
    },
  }

  const handleDelete = () => {
    mutators.change(undefined)
  }

  const renderContent = () => {
    if (materialId) {
      return (
        <div className="batch-import__header">
          <Upload {...uploadProps}>
            <Button type="primary">导入文件</Button>
          </Upload>
          <a href={TEMPLATE} style={{ marginLeft: 20 }}>
            模板下载
          </a>
        </div>
      )
    }

    return <span>请选择活动！</span>
  }

  const renderValue = () => {
    const { name } = value
    if (name) {
      return (
        <div className="batch-import__content">
          <div className="firm">
            <span className="title">{name}</span>
            {editable && <CloseOutlined onClick={handleDelete} />}
          </div>
        </div>
      )
    }
  }

  return (
    <div className="batch-import">
      {editable && renderContent()}
      {renderValue()}
    </div>
  )
}

BatchImport.isFieldComponent = true

export default BatchImport
