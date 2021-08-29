import React, { useEffect, useState } from 'react'
import { Button, message, Space } from 'antd'
import { history } from 'umi'
import querystring from 'querystring'

import { Layout, Action, Search } from '@/components'
import { useTable } from '@/hooks'

import { getDetailSchema, getDetailColumns } from '../config'

const { Header, Content } = Layout

export default props => {
  const {
    match: {
      params: { itemId },
    },
  } = props

  const { table, XmTable } = useTable(
    'beSettlement/orderCheck/detail',
    {},
    { bizId: itemId }
  )
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
    window.location.href = `/cmmc-market/orderAudit/colorDetailExport?${querystring.stringify(
      {
        ids,
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
      <Header title="查看" onBack={handleBack} />
      <Content>
        <Search schema={schema} onSearch={handleSearch} />
        <Space style={{ margin: 10 }}>
          <Button type="primary" onClick={handleExport}>
            导出
          </Button>
        </Space>
        <XmTable columns={columns} scroll={{ x: 1800 }} />
      </Content>
    </Layout>
  )
}
