import React, { useState } from 'react'
import { Upload, message as Message } from 'antd'
import Viewer from 'xm-image-preview'
import {
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons'

import { useVisible } from '@/hooks'
import { validImgSize } from '@/assets/utils'

import './index.less'

interface ISize {
  width: number
  height: number
}

const ImageUpload = (props: any) => {
  const {
    value,
    onChange,
    disabled = false,
    action,
    message,
    max,
    sizeVerify,
    width,
    height,
  } = props
  const [loading, setLoading] = useState(false)
  const imagePreviewModal = useVisible()

  const handlePreview = event => {
    event.stopPropagation()
    imagePreviewModal.open()
  }

  const handleDelete = event => {
    event.stopPropagation()
    onChange()
  }

  const uploadProps = {
    accept: '.jpg,.jpeg,.png',
    action,
    disabled,
    showUploadList: false,
    beforeUpload: file => {
      if (max && file.size > max) {
        Message.warning(`图片过大，限制${max / 1024 / 1024}M以内`)
        return false
      }
      setLoading(true)
      return true
    },
    onSuccess: ({ success, data: url }) => {
      if (success) {
        // 校验文件大小
        if (sizeVerify) {
          validImgSize(url, width, height).then(
            () => onChange(url),
            (error: ISize) => {
              Message.warning(
                `请上传规定尺寸的图片，当前尺寸：${error.width}*${error.height}`
              )
              onChange()
            }
          )
        } else {
          onChange(url)
        }
      }
      setLoading(false)
    },
    onError: error => {
      onChange()
      setLoading(false)
    },
  }

  const renderButton = () => {
    if (loading) {
      return <LoadingOutlined style={{ fontSize: 24 }} />
    }

    return (
      <div>
        <PlusOutlined style={{ fontSize: 24 }} />
        <div className="ant-upload-text">{message}</div>
      </div>
    )
  }

  const renderOperation = () => {
    if (value) {
      return (
        <div className="picture-upload__operation">
          <EyeOutlined onClick={handlePreview} />
          {!disabled && <DeleteOutlined onClick={handleDelete} />}
        </div>
      )
    }
  }

  return (
    <div className="image-upload">
      <Upload {...uploadProps} listType="picture-card">
        {value ? (
          <img className="picture-upload__preview" src={value} />
        ) : (
          renderButton()
        )}
        {renderOperation()}
      </Upload>
      <Viewer
        visible={imagePreviewModal.visible}
        onClose={imagePreviewModal.close}
        images={[{ src: value, alt: '上传图片预览' }]}
      />
    </div>
  )
}

export default ImageUpload
