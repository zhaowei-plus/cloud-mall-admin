import React from 'react'
import { Layout, Action, Search } from '@/components'
import { useVisible, useTable } from '@/hooks'
import { message } from 'antd'

import AddModal from './components/add-modal'
import { getSchema, getColumns } from './config'

const { Content } = Layout

export default () => {
  const addModal = useVisible()
  const { table, XmTable } = useTable('channel/list')
  const { selectedRows } = table.params

  const handleAdd = () => {
    addModal.open({
      type: 'add',
    })
  }

  const handleEdit = () => {
    message.destroy()

    if (selectedRows.length <= 0) {
      message.error('请选择要修改的分公司记录')
      return
    }
    if (selectedRows.length > 1) {
      message.error('请单选分公司记录')
      return
    }

    addModal.open({
      type: 'edit',
      item: selectedRows[0],
    })
  }

  const actionMap = {
    120: handleAdd, // 新增分公司
    121: handleEdit, // 修改分公司
  }

  const schema = getSchema()
  const columns = getColumns()

  return (
    <Layout>
      <Content wrapperClassName="channel">
        <Search schema={schema} onSearch={table.onSearch} />
        <Action actionMap={actionMap} />
        <XmTable columns={columns} scroll={{ x: 1300 }} />
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
