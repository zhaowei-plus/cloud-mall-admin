import React, { useEffect, useState } from 'react'
import { Layout, Action, Search } from '@/components'
import { useVisible, useTable } from '@/hooks'
import { message } from 'antd'
import cookies from 'react-cookies'
import http from '@/api'

import { getSchema, getColumns } from './config'

import EditModal from './components/edit-modal'

const { Content } = Layout

export default () => {
  const editModel = useVisible()
  const { table, XmTable } = useTable('stock/list')
  const [categories, setCategories] = useState([])
  const resourceId = cookies.load('resourceId')
  const { selectedRows } = table.params

  const fetchCategories = () => {
    http.get('category/list', { pageEnable: false, resourceId }).then(res => {
      const { success, data } = res
      if (success) {
        setCategories(
          [{ label: '空', value: -1 }].concat(
            data.rows.map(d => ({ label: d.name, value: d.id }))
          )
        )
      }
    })
  }

  const handleEdit = () => {
    message.destroy()

    if (selectedRows.length <= 0) {
      message.error('请选择要修改的库存记录')
      return
    }
    if (selectedRows.length > 1) {
      message.error('请单选库存记录')
      return
    }

    editModel.open(selectedRows[0])
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const actionMap = {
    42: handleEdit, // 库存修改
  }

  const schema = getSchema(categories)
  const columns = getColumns()

  return (
    <Layout>
      <Content wrapperClassName="inventory-info">
        <Search schema={schema} onSearch={table.onSearch} />
        <Action actionMap={actionMap} />
        <XmTable columns={columns} scroll={{ x: 1100 }} />
        {editModel.visible && (
          <EditModal
            detail={editModel.params}
            onCancel={editModel.close}
            onOk={() => {
              editModel.close()
              table.onFetch()
            }}
          />
        )}
      </Content>
    </Layout>
  )
}
