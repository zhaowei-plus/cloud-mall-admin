import React, { useState } from 'react'
import { Button, Tooltip } from 'antd'
import cs from 'classnames'
import { DeleteOutlined } from '@ant-design/icons'
import { useVisible } from '@/hooks'
import AddModal from './modal/add-modal'

import './index.less'

const CustomBizTypes = (props: any) => {
  const { value = [], editable = true, mutators } = props
  const addModal = useVisible()

  const handleAdd = () => {
    addModal.open()
  }

  const handleDelete = index => {
    const newValue = JSON.parse(JSON.stringify(value))
    newValue.splice(index, 1)
    mutators.change(newValue)
  }

  const handleOk = params => {
    addModal.close()
    mutators.change([...value, params])
  }

  return (
    <div className="custom-biz-types">
      <div
        className={cs('custom-biz-types__header', {
          hidden: !editable,
        })}
      >
        <Button onClick={handleAdd}>新增</Button>
      </div>
      <div className="custom-biz-types__content">
        {value.map((item, index) => (
          <div className="item" key={index}>
            <div className="item__title">
              <Tooltip title={item.bizType}>{item.bizType}</Tooltip>
            </div>
            <div className="item__content">
              <Tooltip title={item.content}>{item.content}</Tooltip>
            </div>
            <div
              className={cs('item__operation', {
                hidden: !editable,
              })}
            >
              <DeleteOutlined onClick={() => handleDelete(index)} />
            </div>
          </div>
        ))}
      </div>
      {addModal.visible && (
        <AddModal onCancel={addModal.close} onOk={handleOk} />
      )}
    </div>
  )
}

CustomBizTypes.isFieldComponent = true

export default CustomBizTypes
