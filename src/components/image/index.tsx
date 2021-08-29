import React from 'react'
import Viewer from 'xm-image-preview'
import { EyeOutlined } from '@ant-design/icons'
import { useVisible } from '@/hooks'
import './index.less'

interface IProps {
  src: string
  className?: string
}

export default (props: IProps) => {
  const { src, className } = props
  const previewModal = useVisible()

  const handlePreview = () => {
    previewModal.open()
  }

  const renderOperation = () => {
    if (src) {
      return (
        <div className="image__operation">
          <EyeOutlined onClick={handlePreview} />
        </div>
      )
    }
  }
  return (
    <div className={`image ${className}`}>
      <img src={src} alt="图片预览" />
      {renderOperation()}
      <Viewer
        visible={previewModal.visible}
        onClose={previewModal.close}
        images={[{ src, alt: '上传图片预览' }]}
      />
    </div>
  )
}
