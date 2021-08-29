import React from 'react'
import { Button, Space, message } from 'antd'
import querystring from 'querystring'
import { history } from 'umi'

import { Layout, Search } from '@/components'
import { useTable } from '@/hooks'
import { getColumns, getSchema } from './config'

const { Header, Content } = Layout

export default props => {
  const {
    match: {
      params: { itemId: confirmId },
    },
  } = props

  const {
    table,
    XmTable,
  } = useTable('confirmationManagement/pushDelivery/detailList', { confirmId })
  const { selectedRows, ...tableParams } = table.params

  const handleSearch = (params: any = {}) => {
    const { confirmCreateStart, confirmCreateEnd, ...rest } = params
    if (confirmCreateStart && confirmCreateEnd) {
      rest.confirmCreateStart = `${confirmCreateStart} 00:00:00`
      rest.confirmCreateEnd = `${confirmCreateEnd} 23:59:59`
    }
    rest.confirmId = Number(confirmId)
    table.onSearch(rest)
  }

  const handleExport = () => {
    const ids = selectedRows.map((record: any) => record.id).join(',')
    if (table.pagination.total === 0) {
      message.destroy()
      message.error('导出失败，订单记录为空')
      return false
    }
    window.location.href = `/cmmc-market/confirm/detail/export?${querystring.stringify(
      {
        ids,
        confirmId: Number(confirmId),
        ...tableParams,
      }
    )}`
  }

  const handleBack = () => {
    history.goBack()
  }

  const schema = getSchema()
  const columns = getColumns()

  return (
    <Layout>
      <Header title="详情" onBack={handleBack} />
      <Content>
        <Search schema={schema} onSearch={handleSearch} />
        <Space style={{ margin: 10 }}>
          <Button type="primary" onClick={handleExport}>
            导出
          </Button>
        </Space>
        <XmTable columns={columns} scroll={{ x: 'max-content' }} />
      </Content>
    </Layout>
  )
}
