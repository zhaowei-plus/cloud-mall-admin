import React from 'react'
import { Tag } from 'antd'
import cs from 'classnames'
import { UnorderedListOutlined, FormOutlined } from '@ant-design/icons'
import { useVisible } from '@/hooks'
import EditModal from './edit-modal'

const PermissionItem = props => {
  const { item, isEdit, isSort, accountTypes = [], onEdit } = props
  const editModal = useVisible()

  const handleOk = params => {
    onEdit(params)
    editModal.close()
  }

  const handleEdit = () => {
    editModal.open(item)
  }

  return (
    <div
      className={cs('permission-item', {
        'sort-enable': isSort,
        'edit-enable': isEdit,
      })}
    >
      <div className="permission-item__title">{item.tabName}</div>
      <div className="permission-item__list">
        {item.accountList.map(accountType => {
          const option = accountTypes.find(
            option => option.value === accountType
          )
          if (option) {
            return <Tag key={accountType}>{option.label}</Tag>
          }
        })}
      </div>
      {isEdit && (
        <div className="permission-item__operation">
          <FormOutlined onClick={handleEdit} />
        </div>
      )}
      {isSort && (
        <div className="permission-item__handler">
          <UnorderedListOutlined />
        </div>
      )}
      {editModal.visible && (
        <EditModal
          accountTypes={accountTypes}
          params={editModal.params}
          onCancel={editModal.close}
          onOk={handleOk}
        />
      )}
    </div>
  )
}

export default PermissionItem
