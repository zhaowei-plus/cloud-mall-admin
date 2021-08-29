import React, { memo, useState } from 'react'
import { Modal, Input, message } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { css } from 'emotion'

import http from '@/api'

const placeHolderEnum = {
  1: '请输入追加的企业编码',
  2: '请输入追加的用户手机号',
}

const Add = ({ visible, onCancel, materialId, listType, callback }) => {
  const [list, setList] = useState([])

  const handleAdd = value => {
    if (!value.trim()) return message.error('不能为空')

    if (listType === 1) {
      if (list.find(it => it.orgId === +value))
        return message.error('请勿重发添加')

      http
        .get('groupTargetCustomer/getOrgInfoByOrgId', { orgId: value })
        .then(({ data }) => {
          setList(pre => [...pre, { ...data }])
        })
    } else if (listType === 2) {
      if (list.find(it => it.mobile === value))
        return message.error('请勿重发添加')

      http
        .get('groupTargetCustomer/getUserInfoByMobile', { mobile: value })
        .then(({ data }) => {
          setList(pre => [...pre, { ...data, mobile: value }])
        })
    }
  }

  const handleDelete = value => {
    if (listType === 1) {
      setList(pre => pre.filter(it => it.orgId !== +value))
    } else if (listType === 2) {
      setList(pre => pre.filter(it => it.mobile !== value))
    }
  }

  const handleSubmit = () => {
    if (!list.length) return message.error('请添加')
    http
      .post('groupTargetCustomer/append', {
        materialId,
        dataList: list.map(it => it.mobile || it.orgId),
      })
      .then(() => {
        callback()
        handleCancel()
        message.success('添加成功')
      })
  }

  const handleCancel = () => {
    onCancel()
    setList([])
  }

  return (
    <Modal
      visible={visible}
      title="单个追加"
      onCancel={handleCancel}
      onOk={handleSubmit}
      destroyOnClose
      bodyStyle={{ maxHeight: 500, overflow: 'auto' }}
    >
      <Input.Search
        allowClear
        placeholder={placeHolderEnum[listType]}
        enterButton="添加"
        onSearch={handleAdd}
      />
      <ul
        className={css`
          margin: 16px 0 0;
          border: 1px solid #e9ecf0;
          display: ${list.length ? 'block' : 'none'};
          padding: 8px;
          > li {
            padding: 8px;
            border: 1px solid #e9ecf0;
            & + li {
              margin-top: 16px;
            }
          }
        `}
      >
        {list.map(it => (
          <li
            className="flex justify-between items-center"
            key={it.mobile || it.orgId}
          >
            <div className="ellipsis">
              <span>{it.userName || it.orgName}</span>
              <span>{`(${it.mobile || it.orgId})`}</span>
            </div>
            <CloseOutlined
              className="pointer"
              onClick={() => handleDelete(it.mobile || it.orgId)}
            />
          </li>
        ))}
      </ul>
    </Modal>
  )
}

export default memo(Add)
