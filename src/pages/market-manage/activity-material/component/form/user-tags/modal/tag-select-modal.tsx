import React, { useState, useEffect } from 'react'
import { Modal, Transfer, message } from 'antd'
import http from '@/api'

export default props => {
  const { params = [], onCancel, onOk } = props

  const [tags, setTags] = useState([])
  const [targetKeys, setTargetKeys] = useState(
    params.map(d => Number(d.custId))
  )

  const fetchTags = () => {
    http.get('material/tags').then(res => {
      if (res.success) {
        setTags(res.data.map(item => ({ key: item.custId, ...item })))
      }
    })
  }

  const handleChange = nextTargetKeys => {
    setTargetKeys(nextTargetKeys)
  }

  const handleOk = () => {
    if (targetKeys.length === 0) {
      message.warning('请选择用户群标签')
    } else {
      onOk(targetKeys.map(d => tags.find(item => item.key === d)))
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return (
    <Modal
      visible
      centered
      width={800}
      onOk={handleOk}
      onCancel={onCancel}
      title="选择用户群标签"
      className="tag-select-modal"
    >
      <Transfer
        showSearch
        dataSource={tags}
        targetKeys={targetKeys}
        onChange={handleChange}
        titles={['未选择', '已选择']}
        render={item => item.custName}
        listStyle={{
          width: 370,
          height: 480,
        }}
      />
    </Modal>
  )
}
