import React from 'react'
import querystring from 'querystring'
import { Button, message, Space } from 'antd'

import { Layout, Search } from '@/components'
import { useTable } from '@/hooks'
import { getDetailSchema, getDetailColumns } from '../config'

const { Header, Content } = Layout

export default props => {
  const {
    history,
    match: {
      params: { itemId },
    },
  } = props
  const { table, XmTable } = useTable(
    'paStatistics/group/detail',
    {},
    { materialId: itemId }
  )
  const { selectedRows, ...tableParams } = table.params

  const handleExport = () => {
    const ids = selectedRows.map((record: any) => record.id).join(',')
    if (table.pagination.total === 0) {
      message.destroy()
      message.error('导出失败，订单记录为空')
      return false
    }
    window.location.href = `/csm-admin/pubRecord/exportOrgPushDetails?${querystring.stringify(
      {
        ids,
        materialId: itemId,
        ...tableParams,
      }
    )}`
  }

  const handleBack = () => {
    history.goBack()
  }

  const schema = getDetailSchema()
  const columns = getDetailColumns()

  return (
    <Layout>
      <Header title="详情" onBack={handleBack} />
      <Content>
        <Search schema={schema} onSearch={table.onSearch} />
        <Space style={{ margin: 10 }}>
          <Button type="primary" onClick={handleExport}>
            导出
          </Button>
        </Space>
        <XmTable columns={columns} scroll={{ x: 1480 }} />
      </Content>
    </Layout>
  )
}
