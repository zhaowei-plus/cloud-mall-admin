import React, { useState } from 'react'
import { Upload, message } from 'antd'
import Viewer from 'xm-image-preview'
import {
  PlusOutlined,
  LoadingOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { validImgSize } from '@/assets/utils'
import { useVisible } from '@/hooks'

import './index.less'

interface ISize {
  width: number
  height: number
}

const PictureUpload = (props: any) => {
  const { value, editable = true, mutators } = props

  const {
    action,
    max,
    tips,
    size: { width, height },
  } = props.props['x-props']

  const [loading, setLoading] = useState(false)
  const imagePreviewModal = useVisible()

  const uploadProps = {
    name: 'file',
    accept: '.jpg,.jpeg,.png',
    action,
    disabled: !editable,
    showUploadList: false,
    listType: 'picture-card',
    beforeUpload: file => {
      if (file.size > max) {
        message.warn('请上传5M以内的图片')
        return false
      }
      setLoading(true)
      return true
    },
    onSuccess: ({ success, data: url }) => {
      if (success) {
        // 校验文件大小
        validImgSize(url, width, height)
          .then(
            () => {
              mutators.change(url)
            },
            (error: ISize) => {
              message.warn(
                `请上传规定尺寸的图片，当前尺寸：${error.width}*${error.height}`
              )
              mutators.change()
            }
          )
          .finally(() => {
            setLoading(false)
          })
      }
    },
  }

  const handlePreview = e => {
    e.stopPropagation()
    imagePreviewModal.open()
  }

  const handleDelete = e => {
    e.stopPropagation()
    mutators.change()
  }

  const renderUploadButton = () => {
    if (value) {
      return <img src={value} alt="avatar" />
    }

    if (loading) {
      return <LoadingOutlined />
    } else {
      return <PlusOutlined />
    }
  }

  const renderOperation = () => {
    if (value) {
      return (
        <div className="picture-upload__operation">
          <EyeOutlined onClick={handlePreview} />
          {editable && <DeleteOutlined onClick={handleDelete} />}
        </div>
      )
    }
  }

  return (
    <div className="picture-upload">
      <Upload {...uploadProps}>
        {renderUploadButton()}
        {renderOperation()}
      </Upload>
      <span className="tips">{tips}</span>
      <span className="message">
        尺寸：{width}*{height}
      </span>
      <Viewer
        visible={imagePreviewModal.visible}
        onClose={imagePreviewModal.close}
        images={[{ src: value, alt: '上传图片预览' }]}
      />
    </div>
  )
}

PictureUpload.isFieldComponent = true

export default PictureUpload
