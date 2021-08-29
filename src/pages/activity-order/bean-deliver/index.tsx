import React from 'react'
import { message } from 'antd'
import querystring from 'querystring'

import { Layout, Action, Search } from '@/components'
import { useTable } from '@/hooks'
import { getSchema, getColumns } from './config'

const { Content } = Layout

export default () => {
  const { table, XmTable } = useTable('activityOrder/beanDeliver/list')
  const { selectedRows, ...tableParams } = table.params

  const handleSearch = (params: any = {}) => {
    const { handleStartTime, handleEndTime, ...rest } = params
    if (handleStartTime && handleEndTime) {
      rest.handleStartTime = `${handleStartTime} 00:00:00`
      rest.handleEndTime = `${handleEndTime} 23:59:59`
    }
    table.onSearch(rest)
  }

  const handleExport = () => {
    const ids = selectedRows.map((record: any) => record.id).join(',')
    if (table.pagination.total === 0) {
      message.destroy()
      message.error('导出失败，订单记录为空')
      return false
    }

    window.location.href = `/cmmc-market/bean/export?${querystring.stringify({
      ids,
      ...tableParams,
    })}`
  }

  const actionMap = {
    128: handleExport, // 导出
  }

  const schema = getSchema()
  const columns = getColumns()

  return (
    <Layout>
      <Content>
        <Search schema={schema} onSearch={handleSearch} />
        <Action actionMap={actionMap} />
        <XmTable columns={columns} scroll={{ x: 1900 }} />
      </Content>
    </Layout>
  )
}
