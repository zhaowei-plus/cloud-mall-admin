import React, { useEffect } from 'react'
import { message, Modal } from 'antd'
import { Layout, Action, Search } from '@/components'
import { useVisible, useTable } from '@/hooks'
import http from '@/api'

import { getSchema, getColumns } from './config'

import './index.less'

import AddModal from './components/add-modal'

const { Content } = Layout

export default () => {
  const addModal = useVisible()
  const { table, XmTable } = useTable('category/list')
  const { selectedRows } = table.params

  const handleAdd = () => {
    addModal.open()
  }

  const handleEdit = () => {
    message.destroy()

    if (selectedRows.length === 0) {
      message.warn('请选择修改的商品类别')
      return false
    }
    if (selectedRows.length > 1) {
      message.warn('请单选商品类别')
      return false
    }
    addModal.open(selectedRows[0])
  }

  const handleDelete = () => {
    message.destroy()

    if (selectedRows.length === 0) {
      message.warn('请选择商品类别')
      return false
    }

    Modal.confirm({
      centered: true,
      title: '提示',
      content: (
        <div>
          <p>
            若删除商品类别，云商城内将不再显示该分类，已有关联的商品信息的类别字段会重置
          </p>
          <p style={{ fontSize: 16 }}>是否确定删除？</p>
        </div>
      ),
      onOk: () => {
        http
          .post('category/delete', { ids: selectedRows.map(d => d.id) })
          .then(res => {
            if (res.success) {
              message.success('删除成功')
              table.onFetch()
            }
          })
      },
    })
  }

  const actionMap = {
    39: handleAdd, // 新增
    40: handleEdit, // 修改
    54: handleDelete, // 删除
  }

  const schema = getSchema()
  const columns = getColumns()

  return (
    <Layout>
      <Content>
        <Search schema={schema} onSearch={table.onSearch} />
        <Action actionMap={actionMap} />
        <XmTable columns={columns} />
        {addModal.visible && (
          <AddModal
            detail={addModal.params}
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
