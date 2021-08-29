import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import querystring from 'querystring'

import { Layout, Action, Search, ProtocolModal } from '@/components'
import { useVisible, useTable } from '@/hooks'

import { getSchema, getColumns } from './config'

import ReservationModal from './components/reservation-modal'

const { Content } = Layout

export default () => {
  const reservationModal = useVisible()
  const protocolModal = useVisible()
  const { table, XmTable } = useTable('activityOrder/reservation/list')
  const { selectedRows, ...tableParams } = table.params

  const handleSearch = (params: any = {}) => {
    const { orderTimeStart, orderTimeEnd, ...rest } = params
    if (orderTimeStart && orderTimeEnd) {
      rest.orderTimeStart = `${orderTimeStart} 00:00:00`
      rest.orderTimeEnd = `${orderTimeEnd} 23:59:59`
    }
    table.onSearch(rest)
  }

  const handleReservation = () => {
    message.destroy()

    if (selectedRows.length <= 0) {
      message.error('请选择要查看的预约记录')
      return
    }
    if (selectedRows.length > 1) {
      message.error('请单选记录做查看')
      return
    }
    reservationModal.open(selectedRows[0])
  }

  const handleExport = () => {
    const idList = selectedRows.map((record: any) => record.id).join(',')
    if (table.pagination.total === 0) {
      message.destroy()
      message.error('导出失败，预约记录为空')
      return false
    }
    window.location.href = `/cmmc-market/activity/reserve/order/export?${querystring.stringify(
      {
        idList,
        ...tableParams,
      }
    )}`
  }

  const actionMap = {
    125: handleReservation, // 预约信息
    126: handleExport, // 导出
  }

  const schema = getSchema()
  const columns = getColumns(protocolModal.open)

  return (
    <Layout>
      <Content>
        <Search schema={schema} onSearch={handleSearch} />
        <Action actionMap={actionMap} />
        <XmTable columns={columns} scroll={{ x: 'max-content' }} />
        {reservationModal.visible && (
          <ReservationModal
            params={reservationModal.params}
            onCancel={reservationModal.close}
          />
        )}
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
