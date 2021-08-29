import React from 'react'
import { message } from 'antd'
import querystring from 'querystring'
import { Layout, Action, Search, ProtocolModal } from '@/components'
import { useTable, useVisible } from '@/hooks'
import { getSchema, getColumns } from './config'

const { Content } = Layout

export default () => {
  const protocolModal = useVisible()
  const { table, XmTable } = useTable('activityOrder/trade/list')
  const { selectedRows, ...tableParams } = table.params

  const handleExport = () => {
    const idList = selectedRows.map((record: any) => record.id).join(',')
    if (table.pagination.total === 0) {
      message.destroy()
      message.error('导出失败，订单记录为空')
      return false
    }
    window.location.href = `/cmmc-market/activity/handle/order/export?${querystring.stringify(
      {
        idList,
        ...tableParams,
      }
    )}`
  }

  const handleSearch = (params: any = {}) => {
    const { orderTimeStart, orderTimeEnd, ...rest } = params
    if (orderTimeStart && orderTimeEnd) {
      rest.orderTimeStart = `${orderTimeStart} 00:00:00`
      rest.orderTimeEnd = `${orderTimeEnd} 23:59:59`
    }
    table.onSearch(rest)
  }

  const actionMap = {
    123: handleExport, // 导出
  }

  const schema = getSchema()
  const columns = getColumns(protocolModal.open)

  return (
    <Layout>
      <Content>
        <Search schema={schema} onSearch={handleSearch} />
        <Action actionMap={actionMap} />
        <XmTable columns={columns} scroll={{ x: 'max-content' }} />
        {protocolModal.visible && (
          <ProtocolModal
            params={protocolModal.params}
            onCancel={protocolModal.close}
          />
        )}
      </Content>
    </Layout>
  )
}
