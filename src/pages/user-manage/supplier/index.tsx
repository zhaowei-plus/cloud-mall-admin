import React, { useEffect } from 'react'
import { Modal, message } from 'antd'
import { Layout, Action, Search } from '@/components'
import { useVisible, useTable } from '@/hooks'
import http from '@/api'

import './index.less'

import AddModal from './components/add-modal'
import { IResponse } from '@/assets/constant'
import { getSchema, getColumns } from './config'

const { Content } = Layout

export default () => {
  const addModal = useVisible()
  const { table, XmTable } = useTable('supplier/list')
  const { selectedRows } = table.params

  const handleAdd = () => {
    addModal.open()
  }

  const handleEdit = () => {
    message.destroy()

    if (selectedRows.length === 0) {
      message.warn('请选择修改的收款方信息')
      return false
    }
    if (selectedRows.length > 1) {
      message.warn('请单选收款方记录')
      return false
    }
    addModal.open(selectedRows[0].id)
  }

  const setStatus = (url: string, status: number) => {
    http
      .post(`supplier/${url}`, {
        ids: selectedRows.map((record: any) => record.id),
        status,
      })
      .then((res: IResponse) => {
        if (res.success) {
          message.success('操作成功')
          table.onFetch()
        }
      })
  }

  // 启用/停用
  const handleStatus = (nextStatus: string) => {
    message.destroy()

    const isAllOn = selectedRows.every((record: any) => record.status === 1)
    const isAllOff = selectedRows.every((record: any) => record.status === 0)

    // 启用
    if (nextStatus === 'On') {
      if (selectedRows.length === 0 || !isAllOff) {
        message.warn('请选择停用状态的公司')
        return false
      } else {
        Modal.confirm({
          centered: true,
          title: '提示',
          content: '确定启用收款方吗？',
          onOk: () => setStatus('enable', 1),
        })
      }
    }

    // 停用
    if (nextStatus === 'Off') {
      if (selectedRows.length === 0 || !isAllOn) {
        message.warn('请选择启用状态的公司')
        return false
      } else {
        Modal.confirm({
          centered: true,
          title: '提示',
          content: (
            <div>
              <p>
                收款方停用后，对应的收款方下的用户账号无法登录，已上架商品将会下架。
              </p>
              <p style={{ fontSize: 16 }}>确定停用收款方吗？</p>
            </div>
          ),
          onOk: () => setStatus('disable', 0),
        })
      }
    }
  }

  const actionMap = {
    27: handleAdd, // 新增
    28: handleEdit, // 修改
    29: () => handleStatus('On'), // 启用
    30: () => handleStatus('Off'), // 停用
  }

  const schema = getSchema()
  const columns = getColumns()

  return (
    <Layout>
      <Content wrapperClassName="supplier">
        <Search schema={schema} onSearch={table.onSearch} />
        <Action actionMap={actionMap} />
        <XmTable columns={columns} scroll={{ x: 1100 }} />
        {addModal.visible && (
          <AddModal
            id={addModal.params}
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
