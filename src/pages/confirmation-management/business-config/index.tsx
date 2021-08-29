import React from 'react'
import { Modal, message } from 'antd'
import cookies from 'react-cookies'

import { Layout, Action } from '@/components'
import { useVisible, useTable } from '@/hooks'
import { getColumns } from './config'

import AddModal from './components/add-modal'

import http from '@/api'
import { IResponse } from '@/assets/constant'

const { Content } = Layout

export default props => {
  const user = cookies.load('user') || {}
  const { inherentBiz } = user
  // 特殊角色：迅盟用户/超管
  const isSpecialRole = [0, 3].includes(+inherentBiz)
  // 特殊 地区可选 全省，市级管理员可选 市级以及以下区县，区县管理员可选区县
  const level = isSpecialRole ? 4 : 3
  const addModal = useVisible()

  const { table, XmTable } = useTable(
    'confirmationManagement/businessConfig/list'
  )
  const { selectedRows } = table.params

  const handleAdd = () => {
    addModal.open({
      level,
    })
  }

  const handleEdit = () => {
    if (selectedRows.length === 1) {
      const [detail] = selectedRows
      addModal.open({
        level,
        detail,
        id: detail.id,
      })
    } else {
      message.destroy()
      message.warning('请选择一个业务类型')
    }
  }

  const handleDelete = () => {
    if (selectedRows.length > 0) {
      Modal.confirm({
        centered: true,
        title: '提示',
        content: (
          <div>
            <p style={{ fontSize: 16 }}>确定删除吗？</p>
          </div>
        ),
        onOk: () =>
          http
            .post('confirmationManagement/businessConfig/delete', {
              ids: selectedRows.map((detail: any) => detail.id),
            })
            .then((res: IResponse) => {
              message.destroy()
              if (res.success) {
                message.success('删除成功')
                table.onFetch()
              } else {
                message.success(res.msg)
              }
            }),
      })
    } else {
      message.destroy()
      message.warning('请选择一个业务配置')
    }
  }

  const actionMap = {
    153: handleAdd, // 新增
    162: handleEdit, // 修改
    154: handleDelete, // 删除
  }
  const columns = getColumns()
  return (
    <Layout>
      <Content>
        <Action actionMap={actionMap} />
        <XmTable columns={columns} scroll={{ x: 'max-content' }} />
        {addModal.visible && (
          <AddModal
            params={addModal.params}
            onCancel={addModal.close}
            onOk={() => {
              addModal.close()
              table.onFetch()
            }}
          />
        )}
      </Content>
    </Layout>
  )
}
