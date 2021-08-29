import React from 'react'
import { message } from 'antd'
import { useLocation } from 'umi'
import querystring from 'querystring'

import { Layout, Action, Search } from '@/components'
import { useTable } from '@/hooks'
import { getSchema, getColumns } from './config'

const { Content } = Layout

export default props => {
  const { history } = props
  const { pathname } = useLocation()

  const { table, XmTable } = useTable('paStatistics/group/list')
  const { selectedRows, ...tableParams } = table.params

  const handleSearch = (params: any = {}) => {
    const { regionCode = [], ...rest } = params
    if (regionCode.length > 1) {
      rest.regionCode = regionCode[regionCode.length - 1]
    }
    table.onSearch(rest)
  }

  const handleDetail = () => {
    if (selectedRows.length === 1) {
      const [record] = selectedRows
      history.push(`${pathname}/detail/${record.materialId}`)
    } else {
      message.destroy()
      message.warning('请单选记录查看')
      return false
    }
  }

  const handleExport = () => {
    const ids = selectedRows.map((record: any) => record.id).join(',')
    if (table.pagination.total === 0) {
      message.destroy()
      message.error('导出失败，订单记录为空')
      return false
    }
    window.location.href = `/csm-admin/pubRecord/exportOrgPushStatics?${querystring.stringify(
      {
        ids,
        ...tableParams,
      }
    )}`
  }

  const actionMap = {
    130: handleDetail, // 查看详情
    131: handleExport, // 导出
  }

  const schema = getSchema()
  const columns = getColumns()

  return (
    <Layout>
      <Content>
        <Search schema={schema} onSearch={handleSearch} />
        <Action actionMap={actionMap} />
        <XmTable columns={columns} scroll={{ x: 2000 }} />
      </Content>
    </Layout>
  )
}
