import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal, Spin, Button } from 'antd'
import http from '@/api'

import './index.less'

interface IProps {
  onCancel: () => void
  params?: any
}

export default (props: IProps) => {
  const { onCancel, params = {} } = props
  const { contractId } = params
  const [file, setFile] = useState()
  const loading = useSelector((state: any) => state.loading)

  const fetchFile = () => {
    http.get('platform/contract', { contractId }).then(res => {
      const { success, data } = res
      if (success) {
        setFile(data)
      }
    })
  }

  useEffect(() => {
    fetchFile()
  }, [contractId])

  return (
    <Modal
      visible
      centered
      width={900}
      title="服务协议"
      onCancel={onCancel}
      className="protocol-modal"
      footer={
        <Button type="primary" onClick={onCancel}>
          确定
        </Button>
      }
    >
      <Spin spinning={loading}>
        <div className="protocol-modal__content">
          <img src={file} />
        </div>
      </Spin>
    </Modal>
  )
}
