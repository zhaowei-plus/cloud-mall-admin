import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import { history } from 'umi'
import querystring from 'querystring'
import cookies from 'react-cookies'
import { Layout, UploadModal, Action, Search } from '@/components'
import { useVisible, useTable } from '@/hooks'
import http from '@/api'

import { getSchema, getColumns } from './config'

const { Content } = Layout
const TEMPLATE = require('@/assets/files/预约订单导入模板.xlsx')

export default () => {
  const importHXModel = useVisible()
  const { table, XmTable } = useTable('reservation/list')
  const [supply, setSupply] = useState({})
  const resourceId = cookies.load('resourceId')
  const { selectedRows, ...tableParams } = table.params

  // 查询收款方公司
  const fetchSupplies = () => {
    http.get('user/supplies', { resourceId }).then((res: any) => {
      const { success, data } = res
      if (success) {
        const { required, selectList = [] } = data
        let defaultValue = undefined
        if (required) {
          const defaultSelected = selectList.find(s => s.selected)
          if (defaultSelected) {
            defaultValue = defaultSelected.id
          }
        }
        setSupply({
          required,
          dataSource: selectList.map(item => ({
            label: item.name,
            value: Number(item.id),
          })),
          default: defaultValue,
        })
      }
    })
  }

  const handleProcess = () => {
    if (selectedRows.length !== 1) {
      message.warn('请单选订单信息')
      return false
    }
    const [{ id, eyunOrder }] = selectedRows
    if (eyunOrder === 1) {
      message.warn('e云商品预约订单仅限自动处理')
      return false
    }
    history.push(`/order-manage/reservation/detail/${id}`)
  }

  const handleExportExcel = () => {
    const orderIds = selectedRows.map((record: any) => record.id).join(',')

    if (table.pagination.total === 0) {
      message.destroy()
      message.error('导出失败，订单记录为空')
      return false
    }

    window.location.href = `/csm-admin/order/exportReserves?${querystring.stringify(
      {
        orderIds,
        ...tableParams,
      }
    )}`
  }

  const handleImportHX = () => {
    importHXModel.open()
  }

  const handleSearch = (params: any = {}) => {
    const { createTimeStart, createTimeEnd, ...rest } = params
    if (createTimeStart && createTimeEnd) {
      rest.createTimeStart = `${createTimeStart} 00:00:00`
      rest.createTimeEnd = `${createTimeEnd} 23:59:59`
    }
    table.onSearch(rest)
  }

  useEffect(() => {
    fetchSupplies()
  }, [])

  const actionMap = {
    51: handleProcess,
    52: handleExportExcel, // 导出EXECl
    53: handleImportHX, // 导入核销
  }

  const schema = getSchema(supply)
  const columns = getColumns()

  return (
    <Layout>
      <Content wrapperClassName="order-manage-trade">
        <Search schema={schema} onSearch={handleSearch} />
        <Action actionMap={actionMap} />
        <XmTable columns={columns} scroll={{ x: 'max-content' }} />
        {importHXModel.visible && (
          <UploadModal
            template={TEMPLATE}
            action="/csm-admin/order/importReserveExcel"
            onCancel={importHXModel.close}
            onOk={() => {
              importHXModel.close()
              table.onFetch()
            }}
          />
        )}
      </Content>
    </Layout>
  )
}
