import React, { useState, Fragment } from 'react'
import { Empty } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { useVisible } from '@/hooks'

import Material from './component/material'
import MaterialSelectModal from './component/material-select-modal'

import './index.less'

const MaterialSelect = props => {
  const { value = {}, mutators, editable = true } = props
  const { id } = value

  const selectModal = useVisible()

  const handleChange = () => {
    selectModal.open({ id })
  }

  const handleOk = (info: any = {}) => {
    selectModal.close()
    if (info.id !== value.id) {
      mutators.change(info)
    }
  }

  const renderContent = () => {
    if (id) {
      return (
        <Fragment>
          <Material material={value} />
          {editable && (
            <a className="material-select__change" onClick={handleChange}>
              更换活动
            </a>
          )}
        </Fragment>
      )
    }

    // 文本态
    if (!editable) {
      return (
        <div className="material-select__empty">
          <Empty description={false} />
        </div>
      )
    }

    // 编辑态
    return (
      <div
        className="material-select__button ant-upload-select ant-upload-select-picture-card"
        onClick={handleChange}
      >
        <PlusOutlined />
        <span className="info">从活动素材库中选择</span>
      </div>
    )
  }

  return (
    <div className="material-select">
      {renderContent()}
      {selectModal.visible && (
        <MaterialSelectModal
          params={selectModal.params}
          onOk={handleOk}
          onCancel={selectModal.close}
        />
      )}
    </div>
  )
}

MaterialSelect.isFieldComponent = true

export default MaterialSelect
