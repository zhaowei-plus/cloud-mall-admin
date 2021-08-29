import React, { useEffect, useState } from 'react'
import { Modal, Spin, message } from 'antd'
import cs from 'classnames'
import { Search } from '@/components'
import { useList } from '@/hooks'
import Material from '../material'
import { getSchema } from './config'

import './index.less'

export default props => {
  const { params = {}, onOk, onCancel } = props
  const { id } = params

  const list = useList(
    'material/list',
    {},
    {
      statusL: '3,4',
      pageEnable: false,
    }
  )
  const [material, setMaterial] = useState({ id }) // 当前选中的素材

  useEffect(() => {
    list.onFetch()
  }, [])

  const handleSelect = (info: any = {}) => {
    setMaterial(info)
  }

  const handleOk = () => {
    if (material.id) {
      onOk(material)
    } else {
      message.destroy()
      message.warning('请选择活动')
    }
  }

  const schema = getSchema()
  const materials = list.dataSource

  return (
    <Modal
      visible
      centered
      width={990}
      title="选择素材"
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Spin spinning={list.loading}>
        <div className="material-select-modal">
          <Search schema={schema} onSearch={list.onSearch} />
          <div
            className={cs('materials', {
              hidden: materials.length === 0,
            })}
          >
            {materials.map(item => (
              <Material
                key={item.id}
                material={item}
                onSelect={handleSelect}
                isSelected={item.id === material.id}
              />
            ))}
          </div>

          <div
            className={cs('empty', {
              hidden: materials.length > 0,
            })}
          >
            <span>暂无可推送素材~</span>
          </div>
        </div>
      </Spin>
    </Modal>
  )
}
