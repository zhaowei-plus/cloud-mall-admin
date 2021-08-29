import React, { useState } from 'react'
import { Modal, Upload, message, Button } from 'antd'
const { Dragger } = Upload

import './index.less'

interface IProps {
  action: string
  template: any
  onOk: () => void
  onCancel: () => void
}

const UploadModal = (props: IProps) => {
  const { onCancel, onOk, action, template } = props
  const [file, setFile] = useState()

  const uploadProps = {
    action,
    name: 'file',
    listType: 'text',
    accept: '.xls,.xlsx',
    onChange({ file }) {
      const { status, response, name } = file
      setFile(file)
      if (status === 'done') {
        if (response.success) {
          message.success(`${name} 导入成功`)
        } else {
          message.error(`${name} 导入失败, ${response.msg}`)
          setFile(undefined)
        }
      } else if (status === 'error') {
        message.error(`${name} 导入失败, 请重试`)
        setFile(undefined)
      }
    },
  }

  return (
    <Modal
      visible
      centered
      title="导入核销"
      onCancel={onCancel}
      className="upload-model"
      footer={
        <Button type="primary" onClick={onOk}>
          确定
        </Button>
      }
    >
      <div className="upload-model__header">
        <span>选择Excel</span>
        <a className="ml10" href={template}>
          下载导入模板
        </a>
      </div>
      <div className="upload-model__content">
        <Dragger {...uploadProps} fileList={file ? [file] : []}>
          <Button>点击选择文件</Button>
        </Dragger>
        {file && <div className="file-list">{file.name}</div>}
      </div>
    </Modal>
  )
}

export default UploadModal
