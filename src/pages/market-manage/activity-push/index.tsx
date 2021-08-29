import React from 'react'
import { message } from 'antd'
import { useLocation } from 'umi'
import querystring from 'querystring'

import { Action, Layout, Search, Preview } from '@/components'
import { useTable } from '@/hooks'
import { getSchema, getColumns } from './config'

import http from '@/api'

const { Content } = Layout

export default props => {
  const { history } = props
  const { pathname } = useLocation()

  const { table, XmTable } = useTable('push/list')
  const { selectedRows, ...tableParams } = table.params

  const handleSearch = (params: any = {}) => {
    const { pushStartTime, pushEndTime, regionCode = [], ...rest } = params
    if (pushStartTime && pushEndTime) {
      rest.pushStartTime = `${pushStartTime} 00:00:00`
      rest.pushEndTime = `${pushEndTime} 23:59:59`
    }
    if (regionCode.length > 0) {
      rest.regionCode = regionCode[regionCode.length - 1]
    }
    table.onSearch(rest)
  }

  const handleAdd = () => {
    history.push(`${pathname}/add`)
  }

  const handleExport = () => {
    const { selectedRows, ...tableParams } = table.params
    const orderIds = selectedRows.map((record: any) => record.id).join(',')

    window.location.href = `/csm-admin/pubRecord/exportRecords?${querystring.stringify(
      {
        orderIds,
        ...tableParams,
      }
    )}`
  }

  const handlePreview = () => {
    if (selectedRows.length !== 1) {
      message.warning('请单选记录')
      return false
    }

    const [record] = selectedRows
    const { materialId } = record
    http.get('material/detail', { id: materialId }).then(res => {
      if (res.success) {
        const { activityUrl } = res.data
        Preview.iframe(activityUrl)
      }
    })
  }

  const handleDetail = () => {
    if (selectedRows.length === 0) {
      message.warning('请单选记录')
      return false
    }
    const [record] = selectedRows
    const { id } = record
    history.push(`${pathname}/detail/${id}`)
  }

  const schema = getSchema()
  const columns = getColumns()
  const actionMap = {
    74: handleAdd, // 新增推送
    75: handleExport, // 导出
    76: handlePreview, // 活动预览
    77: handleDetail, // 查看配置
  }

  return (
    <Layout>
      <Content>
        <Search schema={schema} onSearch={handleSearch} />
        <Action actionMap={actionMap} />
        <XmTable columns={columns} scroll={{ x: 'max-content' }} />
      </Content>
    </Layout>
  )
}
