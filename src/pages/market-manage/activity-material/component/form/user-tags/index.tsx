import React from 'react'
import { Button, Tag } from 'antd'
import cs from 'classnames'

import { useVisible } from '@/hooks'
import TagSelectModal from './modal/tag-select-modal'

import './index.less'

const UserTags = (props: any) => {
  const { value = [], editable = true, mutators } = props

  const tagSelectModal = useVisible()

  const handleSelect = () => {
    tagSelectModal.open(value)
  }

  const handleOk = params => {
    tagSelectModal.close()
    mutators.change(params)
  }

  return (
    <div className="user-tags">
      <div
        className={cs('user-tags__header', {
          hidden: !editable,
        })}
      >
        <a onClick={handleSelect}>选择用户群标签</a>
      </div>
      <div className="user-tags__content">
        {value.map(item => (
          <Tag color="blue" key={item.custId}>
            {item.custName}
          </Tag>
        ))}
      </div>
      {tagSelectModal.visible && (
        <TagSelectModal
          params={tagSelectModal.params}
          onCancel={tagSelectModal.close}
          onOk={handleOk}
        />
      )}
    </div>
  )
}

UserTags.isFieldComponent = true

export default UserTags
