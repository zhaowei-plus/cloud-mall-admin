import React, { useEffect, useState } from 'react'
import cookies from 'react-cookies'
import { message } from 'antd'
import querystring from 'querystring'

import { Layout, UploadModal, Action, Search } from '@/components'
import { useVisible, useTable } from '@/hooks'
import http from '@/api'

import { getSchema, getColumns } from './config'

const { Content } = Layout
const TEMPLATE = require('@/assets/files/购买订单导入模板.xlsx')

export default () => {
  const importHXModel = useVisible()
  const { table, XmTable } = useTable('trade/list')
  const [supply, setSupply] = useState({})
  const resourceId = cookies.load('resourceId')

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

  const handleImportHX = () => {
    importHXModel.open()
  }

  const handleExportExcel = () => {
    const { selectedRows, ...tableParams } = table.params
    const orderIds = selectedRows.map((record: any) => record.id).join(',')

    if (table.pagination.total === 0) {
      message.destroy()
      message.error('导出失败，订单记录为空')
      return false
    }

    window.location.href = `/csm-admin/order/exportOrders?${querystring.stringify(
      {
        orderIds,
        ...tableParams,
      }
    )}`
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
    49: handleExportExcel, // 导出EXECl
    50: handleImportHX, // 导入核销
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
            action="/csm-admin/order/importExcel"
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
