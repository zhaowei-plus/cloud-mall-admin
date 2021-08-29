import React, { useEffect, useState } from 'react'
import { Button, message, Space } from 'antd'
import { history } from 'umi'
import querystring from 'querystring'

import { Layout } from '@/components'
import { useTable } from '@/hooks'

import { getDetailColumns } from '../config'

const { Header, Content } = Layout

export default props => {
  const {
    match: {
      params: { itemId },
    },
  } = props

  const { table, XmTable } = useTable(
    'beSettlement/beDeliver/detail',
    {},
    { bizId: itemId }
  )

  const handleExport = () => {
    if (table.pagination.total === 0) {
      message.destroy()
      message.error('导出失败，订单记录为空')
      return false
    }
    window.location.href = `/cmmc-market/settlement/colorDetailExport?${querystring.stringify(
      { bizId: itemId }
    )}`
  }

  const handleBack = () => {
    history.goBack()
  }

  const columns = getDetailColumns()

  return (
    <Layout>
      <Header title="查看" onBack={handleBack} />
      <Content>
        <Space style={{ margin: 10 }}>
          <Button type="primary" onClick={handleExport}>
            导出
          </Button>
        </Space>
        <XmTable columns={columns} />
      </Content>
    </Layout>
  )
}
